/**
 * CRM Workflow Custom Code: Sync JAX Social Stats
 *
 * Trigger: Daily scheduled workflow
 * What it does:
 *   1. Fetches social media stats from JAX bot
 *   2. Writes daily snapshot to CRM Custom Objects
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

async function getSocialStats() {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/jax/stats`);
    return {
      followers: res.data?.followers || res.data?.socialStats?.followers || 0,
      totalLikes: res.data?.totalLikes || res.data?.socialStats?.totalLikes || 0,
      totalRetweets: res.data?.totalRetweets || res.data?.socialStats?.totalRetweets || 0,
    };
  } catch {
    return null;
  }
}

async function main() {
  const stats = await getSocialStats();

  if (!stats) {
    return { message: "Could not fetch social stats", timestamp: new Date().toISOString() };
  }

  const today = new Date().toISOString().split("T")[0];

  await crmRequest("POST", "/objects/custom_objects.jax_social_stats/records", {
    locationId,
    properties: {
      date: today,
      follower_count: stats.followers,
      total_likes: stats.totalLikes,
      total_retweets: stats.totalRetweets,
    },
  });

  return {
    saved: true,
    date: today,
    stats,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
