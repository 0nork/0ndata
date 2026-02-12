// JAX-specific CRM Custom Object schema definitions

import { registerSchema } from "./registry";

export function registerJaxSchemas(): void {
  registerSchema({
    name: "Predictions",
    key: "predictions",
    description: "JAX crypto price predictions",
    fields: [
      { name: "Coin", key: "coin", dataType: "TEXT", required: true },
      { name: "Direction", key: "direction", dataType: "TEXT", required: true },
      { name: "Confidence", key: "confidence", dataType: "NUMBER" },
      { name: "Models Used", key: "models_used", dataType: "TEXT" },
      { name: "Entry Price", key: "entry_price", dataType: "NUMBER" },
      { name: "Target Price", key: "target_price", dataType: "NUMBER" },
      { name: "Result", key: "result", dataType: "TEXT" },
      { name: "Verified At", key: "verified_at", dataType: "DATE" },
      { name: "Cycle Number", key: "cycle_number", dataType: "NUMBER" },
    ],
  });

  registerSchema({
    name: "Prediction Stats",
    key: "prediction_stats",
    description: "Daily aggregated prediction statistics",
    fields: [
      { name: "Date", key: "date", dataType: "DATE", required: true },
      { name: "Win Rate", key: "win_rate", dataType: "NUMBER" },
      { name: "Total Predictions", key: "total_predictions", dataType: "NUMBER" },
      { name: "Wins", key: "wins", dataType: "NUMBER" },
      { name: "Losses", key: "losses", dataType: "NUMBER" },
      { name: "Streak", key: "streak", dataType: "NUMBER" },
      { name: "Interval Minutes", key: "interval_minutes", dataType: "NUMBER" },
    ],
  });

  registerSchema({
    name: "JAX Unlocks",
    key: "jax_unlocks",
    description: "Earned JAX unlock records",
    fields: [
      { name: "Unlock ID", key: "unlock_id", dataType: "TEXT", required: true },
      { name: "Unlocked At", key: "unlocked_at", dataType: "DATE" },
      { name: "Triggered By", key: "triggered_by", dataType: "TEXT" },
      { name: "Notification Sent", key: "notification_sent", dataType: "BOOLEAN" },
    ],
  });

  registerSchema({
    name: "JAX Sentences",
    key: "jax_sentences",
    description: "JAX generated sentences and narratives",
    fields: [
      { name: "Text", key: "text", dataType: "TEXT", required: true },
      { name: "Cycle Number", key: "cycle_number", dataType: "NUMBER" },
      { name: "Models Used", key: "models_used", dataType: "TEXT" },
      { name: "Emotion", key: "emotion", dataType: "TEXT" },
      { name: "Context", key: "context", dataType: "TEXT" },
    ],
  });

  registerSchema({
    name: "JAX Social Stats",
    key: "jax_social_stats",
    description: "Daily social media metrics",
    fields: [
      { name: "Date", key: "date", dataType: "DATE", required: true },
      { name: "Followers", key: "followers", dataType: "NUMBER" },
      { name: "Total Likes", key: "total_likes", dataType: "NUMBER" },
      { name: "Total Retweets", key: "total_retweets", dataType: "NUMBER" },
    ],
  });
}
