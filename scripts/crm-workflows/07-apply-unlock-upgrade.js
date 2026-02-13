/**
 * CRM Workflow Custom Code: Apply Unlock Upgrade to JAX Config
 *
 * Trigger: After a new unlock is recorded in CRM (from milestone check)
 * What it does:
 *   1. Reads the unlock that just fired
 *   2. Maps the unlock to a specific JAX Config change
 *   3. Updates the JAX Config record in CRM
 *   4. Optionally notifies the JAX bot to reload config
 *
 * This is the ENGINE that makes unlocks actually change JAX's behavior.
 *
 * Input Data:
 *   - locationId, crmApiKey, jaxApiUrl
 *   - unlockId: The unlock that was just achieved
 *   - unlockName: Human-readable name
 */

const axios = require("axios");

const CRM_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

const locationId = inputData.locationId || "2ro22dYDzTD41y7R5VWi";
const jaxApiUrl = inputData.jaxApiUrl || "https://www.jaxxai.com";
const crmApiKey = inputData.crmApiKey;
const unlockId = inputData.unlockId || "";
const unlockName = inputData.unlockName || "";

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

/**
 * UNLOCK → CONFIG UPGRADE MAP
 *
 * Each unlock ID maps to the exact JAX Config properties that change.
 * Based on the 52 unlocks from JAX unlock-definitions.ts:
 *
 * ACT 1: Foundation (0-10 predictions)
 * ACT 2: Growth (10-50 predictions)
 * ACT 3: Intelligence (50-200 predictions)
 * ACT 4: Mastery (200-1000 predictions)
 * ACT 5: Transcendence (1000+ predictions)
 */
const UPGRADE_MAP = {
  // === ACT 1: Foundation ===
  "first-prediction": {
    // No config change — just recognition
    description: "JAX made its first prediction",
  },
  "first-win": {
    description: "First correct prediction",
  },
  "three-streak": {
    description: "Three wins in a row",
  },
  "first-sentence": {
    enabled_features: "predictions,sentences",
    description: "JAX can now generate sentences",
  },

  // === ACT 2: Growth ===
  "ten-predictions": {
    prediction_interval: 12,
    description: "Faster predictions: 15min → 12min",
  },
  "five-streak": {
    enabled_coins: "BTC,ETH,SOL,DOGE",
    description: "DOGE added to coin roster",
  },
  "twenty-predictions": {
    prediction_interval: 10,
    description: "Faster predictions: 12min → 10min",
  },
  "fifty-percent-win-rate": {
    active_models: "gpt4,claude,gemini,deepseek",
    description: "DeepSeek model unlocked",
  },

  // === ACT 3: Intelligence ===
  "fifty-predictions": {
    prediction_interval: 8,
    enabled_coins: "BTC,ETH,SOL,DOGE,ADA,AVAX",
    description: "8min interval, ADA + AVAX added",
  },
  "ten-streak": {
    enabled_features: "predictions,sentences,analysis",
    description: "Market analysis feature unlocked",
  },
  "hundred-predictions": {
    prediction_interval: 5,
    description: "Rapid fire: 5min intervals",
  },
  "sixty-percent-win-rate": {
    active_models: "gpt4,claude,gemini,deepseek,llama",
    description: "Llama model unlocked — full 5-model ensemble",
  },

  // === ACT 4: Mastery ===
  "two-hundred-predictions": {
    prediction_interval: 3,
    enabled_coins: "BTC,ETH,SOL,DOGE,ADA,AVAX,LINK,DOT,MATIC,UNI",
    description: "3min interval, full 10-coin roster",
  },
  "twenty-streak": {
    enabled_features: "predictions,sentences,analysis,social",
    description: "Social posting feature unlocked",
  },
  "seventy-percent-win-rate": {
    autonomous_mode: "full",
    description: "Full autonomous mode activated",
  },

  // === ACT 5: Transcendence ===
  "thousand-predictions": {
    prediction_interval: 1,
    description: "Maximum speed: 1min intervals",
  },
  "fifty-streak": {
    enabled_features: "predictions,sentences,analysis,social,trading",
    description: "Trading signals feature unlocked",
  },
  "eighty-percent-win-rate": {
    description: "JAX has transcended — legendary status",
  },
};

async function getJaxConfigRecord() {
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_config/records?locationId=${locationId}&limit=1`
  );
  const records = res.data?.objects || res.data?.records || [];
  return records.length > 0 ? records[0] : null;
}

async function applyUpgrade(configRecordId, upgrade) {
  const properties = {};
  for (const [key, value] of Object.entries(upgrade)) {
    if (key !== "description") {
      properties[key] = value;
    }
  }

  if (Object.keys(properties).length === 0) return null;

  return crmRequest("PUT", `/objects/custom_objects.jax_config/records/${configRecordId}`, {
    locationId,
    properties,
  });
}

async function markUnlockNotified() {
  // Find the unlock record and mark notification_sent
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.jax_unlocks/records?locationId=${locationId}&limit=100`
  );
  const records = res.data?.objects || res.data?.records || [];
  const record = records.find((r) => (r.properties || r).unlock_id === unlockId);

  if (record) {
    await crmRequest("PUT", `/objects/custom_objects.jax_unlocks/records/${record.id}`, {
      locationId,
      properties: { notification_sent: "true" },
    });
  }
}

async function main() {
  const upgrade = UPGRADE_MAP[unlockId];

  if (!upgrade) {
    return {
      unlockId,
      unlockName,
      status: "no_upgrade_mapped",
      message: `Unlock "${unlockId}" has no config changes mapped`,
      timestamp: new Date().toISOString(),
    };
  }

  const configRecord = await getJaxConfigRecord();
  if (!configRecord) {
    return {
      unlockId,
      status: "error",
      message: "No JAX Config record found",
      timestamp: new Date().toISOString(),
    };
  }

  const result = await applyUpgrade(configRecord.id, upgrade);
  await markUnlockNotified();

  return {
    unlockId,
    unlockName,
    status: "upgraded",
    description: upgrade.description,
    configChanges: Object.keys(upgrade).filter((k) => k !== "description"),
    configRecordId: configRecord.id,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
