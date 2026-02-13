/**
 * CRM Workflow Custom Code: Generate JAX Sentence
 *
 * Trigger: After unlock achievement or on milestone
 * What it does:
 *   1. Calls JAX bot sentence generation endpoint
 *   2. Saves sentence to CRM Custom Objects
 *
 * Input Data:
 *   - locationId, crmApiKey, jaxApiUrl
 *   - triggerType: "unlock" | "milestone" | "cycle"
 */

const axios = require("axios");

const CRM_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

const locationId = inputData.locationId || "2ro22dYDzTD41y7R5VWi";
const jaxApiUrl = inputData.jaxApiUrl || "https://www.jaxxai.com";
const crmApiKey = inputData.crmApiKey;
const triggerType = inputData.triggerType || "cycle";

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

async function generateSentence() {
  try {
    const res = await axios.get(`${jaxApiUrl}/api/jax/sentences?limit=1`);
    const sentences = res.data?.sentences || [];
    return sentences.length > 0 ? sentences[0] : null;
  } catch {
    return null;
  }
}

async function saveSentence(sentence) {
  return crmRequest("POST", "/objects/custom_objects.jax_sentences/records", {
    locationId,
    properties: {
      text: sentence.text || sentence.content || "",
      cycle_number: sentence.cycleNumber || sentence.cycle_number || 0,
      models_used: sentence.modelsUsed || sentence.models_used || "",
      emotion: sentence.emotion || "",
      context: triggerType,
    },
  });
}

async function main() {
  const sentence = await generateSentence();

  if (!sentence) {
    return { message: "No sentence available", trigger: triggerType, timestamp: new Date().toISOString() };
  }

  await saveSentence(sentence);

  return {
    saved: true,
    text: sentence.text || sentence.content,
    emotion: sentence.emotion,
    trigger: triggerType,
    timestamp: new Date().toISOString(),
  };
}

main()
  .then((result) => callback(null, [{ output: JSON.stringify(result) }]))
  .catch((err) => callback(null, [{ output: JSON.stringify({ error: err.message }) }]));
