/**
 * CRM Workflow Custom Code: Run JAX Prediction Cycle
 *
 * Trigger: Scheduled (every 15 min) or manual trigger link
 * What it does:
 *   1. Reads JAX Config from CRM to get current settings
 *   2. Calls JAX bot /api/crypto/predict for each enabled coin
 *   3. Writes prediction records to CRM Custom Objects
 *   4. Updates prediction stats
 *
 * Input Data (from workflow):
 *   - locationId: The CRM location ID
 *   - jaxApiUrl: JAX bot base URL (e.g., https://www.jaxxai.com)
 *   - crmApiKey: PIT or access token for CRM API
 */

const axios = require("axios");

const CRM_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

// Get values from workflow input
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
  if (method === "GET") {
    config.params = { locationId };
  }
  if (body) {
    config.data = body;
  }
  return axios(config);
}

async function getJaxConfig() {
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_config/records?locationId=${locationId}&limit=1`
  );
  const records = res.data?.objects || res.data?.records || [];
  if (records.length > 0) {
    return records[0].properties || records[0];
  }
  // Default config
  return {
    prediction_interval: 15,
    enabled_coins: "BTC,ETH,SOL",
    active_models: "gpt4,claude,gemini",
    autonomous_mode: "true",
  };
}

async function runPrediction(coin) {
  const res = await axios.post(`${jaxApiUrl}/api/crypto/predict`, {
    coin,
    source: "crm-workflow",
  });
  return res.data;
}

async function savePrediction(prediction) {
  return crmRequest("POST", "/objects/custom_objects.predictions/records", {
    locationId,
    properties: {
      coin: prediction.coin || prediction.symbol,
      direction: prediction.direction || prediction.prediction,
      confidence: prediction.confidence || 0,
      models_used: Array.isArray(prediction.models)
        ? prediction.models.join(",")
        : String(prediction.modelsUsed || ""),
      entry_price: prediction.entryPrice || prediction.entry_price || 0,
      target_price: prediction.targetPrice || prediction.target_price || 0,
      result: "PENDING",
      verified_at: "",
      cycle_number: prediction.cycleNumber || prediction.cycle_number || 0,
    },
  });
}

async function main() {
  const config = await getJaxConfig();
  const coins = (config.enabled_coins || "BTC,ETH,SOL").split(",").map(c => c.trim());

  const results = [];
  for (const coin of coins) {
    try {
      const prediction = await runPrediction(coin);
      await savePrediction(prediction);
      results.push({ coin, status: "ok", direction: prediction.direction || prediction.prediction });
    } catch (err) {
      results.push({ coin, status: "error", error: err.message });
    }
  }

  return { predictions: results, coinsProcessed: results.length, timestamp: new Date().toISOString() };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
