/**
 * CRM Workflow Custom Code: Check Milestones & Trigger Unlocks
 *
 * Trigger: Runs after prediction verification
 * What it does:
 *   1. Gets current aggregate stats from JAX bot
 *   2. Evaluates all 52 unlocks against current stats
 *   3. Creates unlock records in CRM for newly achieved unlocks
 *   4. Updates JAX Config if unlock changes bot settings
 *
 * Input Data:
 *   - locationId, crmApiKey, jaxApiUrl
 */

const axios = require("axios");

const CRM_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

const locationId = inputData.locationId || "2ro22dYDzTD41y7R5VWi";
const jaxApiUrl = inputData.jaxApiUrl || "https://www.jaxxai.com";
const crmApiKey = inputData.crmApiKey;

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

async function getJaxStats() {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/jax/stats`);
    return res.data;
  } catch {
    return null;
  }
}

async function getJaxUnlocks() {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/jax/unlocks`);
    return res.data;
  } catch {
    return null;
  }
}

async function getExistingUnlockRecords() {
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_unlocks/records?locationId=${locationId}&limit=100`
  );
  const records = res.data?.objects || res.data?.records || [];
  return records.map((r) => (r.properties || r).unlock_id);
}

async function createUnlockRecord(unlock) {
  return crmRequest("POST", "/objects/custom_objects.jax_unlocks/records", {
    locationId,
    properties: {
      unlock_id: unlock.id,
      unlock_name: unlock.name || unlock.title,
      unlocked_at: new Date().toISOString(),
      triggered_by: "milestone_check",
      notification_sent: "false",
    },
  });
}

// Maps unlock types to JAX Config changes
const UNLOCK_CONFIG_MAP = {
  // Prediction interval unlocks
  faster_predictions: { prediction_interval: 10 },
  rapid_fire: { prediction_interval: 5 },
  instant_analysis: { prediction_interval: 2 },

  // Coin unlocks
  altcoin_access: { enabled_coins: "BTC,ETH,SOL,DOGE,ADA,AVAX" },
  full_market: { enabled_coins: "BTC,ETH,SOL,DOGE,ADA,AVAX,LINK,DOT,MATIC,UNI" },

  // Feature unlocks
  sentence_generator: { enabled_features: "predictions,sentences,social" },
  full_autonomy: { autonomous_mode: "true", enabled_features: "predictions,sentences,social,analysis" },

  // Model unlocks
  multi_model: { active_models: "gpt4,claude,gemini,deepseek,llama" },
};

async function updateJaxConfig(unlockId) {
  const configUpdate = UNLOCK_CONFIG_MAP[unlockId];
  if (!configUpdate) return null;

  // Get current config record
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_config/records?locationId=${locationId}&limit=1`
  );
  const records = res.data?.objects || res.data?.records || [];
  if (records.length === 0) return null;

  const configRecordId = records[0].id;
  return crmRequest("PUT", `/objects/custom_objects.jax_config/records/${configRecordId}`, {
    locationId,
    properties: configUpdate,
  });
}

async function main() {
  const [stats, botUnlocks] = await Promise.all([getJaxStats(), getJaxUnlocks()]);

  if (!botUnlocks) {
    return { message: "Could not fetch unlock status from JAX bot", timestamp: new Date().toISOString() };
  }

  // Get existing unlock records from CRM
  const existingIds = await getExistingUnlockRecords();

  // Find newly unlocked items
  const catalog = botUnlocks.catalog || botUnlocks.unlocks || [];
  const newUnlocks = catalog.filter(
    (u) => u.unlocked && !existingIds.includes(u.id)
  );

  const results = [];
  for (const unlock of newUnlocks) {
    try {
      await createUnlockRecord(unlock);
      await updateJaxConfig(unlock.id);
      results.push({ id: unlock.id, name: unlock.name || unlock.title, status: "created" });
    } catch (err) {
      results.push({ id: unlock.id, status: "error", error: err.message });
    }
  }

  return {
    totalUnlocks: catalog.length,
    alreadyRecorded: existingIds.length,
    newUnlocks: results.length,
    details: results,
    stats: stats ? {
      winRate: stats.winRate,
      totalPredictions: stats.totalPredictions,
      wins: stats.wins,
    } : null,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
