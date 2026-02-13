/**
 * CRM Workflow Custom Code: Verify Pending Predictions
 *
 * Trigger: Scheduled (runs after prediction cycle, e.g., 30 min delay)
 * What it does:
 *   1. Fetches all PENDING predictions from CRM
 *   2. Checks current prices to verify if predictions hit target
 *   3. Updates prediction records with WIN/LOSS result
 *   4. Updates aggregate stats in prediction_stats
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

async function getPendingPredictions() {
  const res = await crmRequest(
    "GET",
    `/objects/custom_objects.predictions/records?locationId=${locationId}&limit=100`
  );
  const records = res.data?.objects || res.data?.records || [];
  return records.filter((r) => {
    const props = r.properties || r;
    return props.result === "PENDING" || !props.result;
  });
}

async function getCurrentPrice(coin) {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/crypto/price?coin=${coin}`);
    return res.data?.price || res.data?.currentPrice || 0;
  } catch {
    return 0;
  }
}

async function verifyPrediction(record) {
  const props = record.properties || record;
  const currentPrice = await getCurrentPrice(props.coin);

  if (!currentPrice) return { id: record.id, status: "skip", reason: "no price" };

  const entryPrice = Number(props.entry_price) || 0;
  const targetPrice = Number(props.target_price) || 0;
  const direction = (props.direction || "").toUpperCase();

  let result = "PENDING";
  if (direction === "UP" && currentPrice >= targetPrice) result = "WIN";
  else if (direction === "UP" && currentPrice < entryPrice * 0.97) result = "LOSS";
  else if (direction === "DOWN" && currentPrice <= targetPrice) result = "WIN";
  else if (direction === "DOWN" && currentPrice > entryPrice * 1.03) result = "LOSS";

  if (result !== "PENDING") {
    await crmRequest("PUT", `/objects/custom_objects.predictions/records/${record.id}`, {
      locationId,
      properties: {
        result,
        verified_at: new Date().toISOString(),
      },
    });
  }

  return { id: record.id, coin: props.coin, result, currentPrice };
}

async function updateStats(verifiedResults) {
  const wins = verifiedResults.filter((r) => r.result === "WIN").length;
  const losses = verifiedResults.filter((r) => r.result === "LOSS").length;
  const total = wins + losses;

  if (total === 0) return;

  const today = new Date().toISOString().split("T")[0];
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  await crmRequest("POST", "/objects/custom_objects.prediction_stats/records", {
    locationId,
    properties: {
      date: today,
      win_rate: winRate,
      total_predictions: total,
      wins,
      losses,
      streak: wins, // simplified — full streak tracking done in milestone check
      interval_minutes: 15,
    },
  });
}

async function main() {
  const pending = await getPendingPredictions();
  if (pending.length === 0) {
    return { message: "No pending predictions", timestamp: new Date().toISOString() };
  }

  const results = [];
  for (const record of pending) {
    const r = await verifyPrediction(record);
    results.push(r);
  }

  await updateStats(results);

  return {
    verified: results.length,
    wins: results.filter((r) => r.result === "WIN").length,
    losses: results.filter((r) => r.result === "LOSS").length,
    stillPending: results.filter((r) => r.result === "PENDING").length,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
