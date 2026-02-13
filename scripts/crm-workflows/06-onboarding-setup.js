/**
 * CRM Workflow Custom Code: JAX Onboarding Setup
 *
 * Trigger: When user completes onboarding wizard (trigger link click)
 * What it does:
 *   1. Creates the default JAX Config record if it doesn't exist
 *   2. Writes initial prediction stats record (baseline)
 *   3. Kicks off first prediction cycle
 *   4. Returns onboarding status
 *
 * Input Data:
 *   - locationId, crmApiKey, jaxApiUrl
 *   - contactId: The user who completed onboarding
 *   - selectedCoins: Comma-separated coin list from wizard (optional)
 *   - selectedInterval: Prediction interval from wizard (optional)
 */

const axios = require("axios");

const CRM_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

const locationId = inputData.locationId || "2ro22dYDzTD41y7R5VWi";
const jaxApiUrl = inputData.jaxApiUrl || "https://www.jaxxai.com";
const crmApiKey = inputData.crmApiKey;
const contactId = inputData.contactId || "";
const selectedCoins = inputData.selectedCoins || "BTC,ETH,SOL";
const selectedInterval = Number(inputData.selectedInterval) || 15;

async function crmRequest(method, path, body) {
  const config = {
    method,
    url: `${CRM_BASE}${path}`,
    headers: {
      Authorization: `Bearer ${crmApiKey}`,
      Version: CRM_VERSION,
      "Content-Type": "application/json",
    },
  };
  if (body) config.data = body;
  return axios(config);
}

async function ensureJaxConfig() {
  // Check if config exists
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_config/records?locationId=${locationId}&limit=1`
  );
  const records = res.data?.objects || res.data?.records || [];

  if (records.length > 0) {
    // Update existing config with user preferences
    const configId = records[0].id;
    await crmRequest("PUT", `/objects/custom_objects.jax_config/records/${configId}`, {
      locationId,
      properties: {
        enabled_coins: selectedCoins,
        prediction_interval: selectedInterval,
      },
    });
    return { action: "updated", id: configId };
  }

  // Create new config
  const createRes = await crmRequest("POST", "/objects/custom_objects.jax_config/records", {
    locationId,
    properties: {
      config_key: "default",
      prediction_interval: selectedInterval,
      enabled_coins: selectedCoins,
      enabled_features: "predictions,sentences",
      active_models: "gpt4,claude,gemini",
      autonomous_mode: "true",
    },
  });

  return { action: "created", id: createRes.data?.record?.id };
}

async function createBaselineStats() {
  const today = new Date().toISOString().split("T")[0];
  await crmRequest("POST", "/objects/custom_objects.prediction_stats/records", {
    locationId,
    properties: {
      date: today,
      win_rate: 0,
      total_predictions: 0,
      wins: 0,
      losses: 0,
      streak: 0,
      interval_minutes: selectedInterval,
    },
  });
}

async function triggerFirstCycle() {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/cron/jax-cycle`);
    return res.data;
  } catch (err) {
    return { error: err.message };
  }
}

async function tagContact() {
  if (!contactId) return;
  try {
    await crmRequest("PUT", `/contacts/${contactId}`, {
      tags: ["jax-onboarded", "0ndata-active"],
    });
  } catch {
    // Non-critical
  }
}

async function main() {
  const configResult = await ensureJaxConfig();
  await createBaselineStats();
  await tagContact();

  const cycleResult = await triggerFirstCycle();

  return {
    onboarding: "complete",
    config: configResult,
    coins: selectedCoins,
    interval: selectedInterval,
    firstCycle: cycleResult,
    contactId,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
