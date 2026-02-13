// JAX model definitions — typed wrappers around the base Model class

import { Model } from "@/lib/orm/model";

// Schema registration (call once at app init)
import { registerJaxSchemas } from "@/lib/schemas/jax-schemas";
registerJaxSchemas();

// Type definitions for each schema

export interface PredictionRecord {
  coin: string;
  direction: string;
  confidence: number;
  modelsUsed: string;
  entryPrice: number;
  targetPrice: number;
  result: string;
  verifiedAt: string;
  cycleNumber: number;
}

export interface PredictionStatsRecord {
  date: string;
  winRate: number;
  totalPredictions: number;
  wins: number;
  losses: number;
  streak: number;
  intervalMinutes: number;
}

export interface JaxUnlockRecord {
  unlockId: string;
  unlockedAt: string;
  triggeredBy: string;
  notificationSent: boolean;
}

export interface JaxSentenceRecord {
  text: string;
  cycleNumber: number;
  modelsUsed: string;
  emotion: string;
  context: string;
}

export interface JaxSocialStatsRecord {
  date: string;
  followers: number;
  totalLikes: number;
  totalRetweets: number;
}

export interface JaxConfigRecord {
  configKey: string;
  predictionInterval: number;
  enabledCoins: string;
  enabledFeatures: string;
  activeModels: string;
  autonomousMode: string;
}

// Model factory functions (pass locationId at runtime)

export function Prediction(locationId: string) {
  return new Model<PredictionRecord>("predictions", locationId);
}

export function PredictionStats(locationId: string) {
  return new Model<PredictionStatsRecord>("prediction_stats", locationId);
}

export function JaxUnlock(locationId: string) {
  return new Model<JaxUnlockRecord>("jax_unlocks", locationId);
}

export function JaxSentence(locationId: string) {
  return new Model<JaxSentenceRecord>("jax_sentences", locationId);
}

export function JaxSocialStats(locationId: string) {
  return new Model<JaxSocialStatsRecord>("jax_social_stats", locationId);
}

export function JaxConfig(locationId: string) {
  return new Model<JaxConfigRecord>("jax_config", locationId);
}
