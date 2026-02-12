import { NextResponse } from "next/server";
import { PredictionStats, JaxSocialStats, JaxUnlock } from "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

// Unlock catalog — adapted from jax-2026-prediction-bot
const UNLOCK_CATALOG = [
  // Act I: The Awakening
  { id: "first-prediction", name: "First Prediction", threshold: 1, type: "predictions", act: 1 },
  { id: "triple-threat", name: "Triple Threat", threshold: 3, type: "streak", act: 1 },
  { id: "second-sentence", name: "Second Sentence", threshold: 60, type: "accuracy", act: 1, secondary: 10 },
  { id: "double-down", name: "Double Down", threshold: 10, type: "predictions", act: 1 },
  { id: "data-driven", name: "Data Driven", threshold: 25, type: "predictions", act: 1 },
  { id: "pattern-seeker", name: "Pattern Seeker", threshold: 50, type: "predictions", act: 1 },
  { id: "story-chapter-1", name: "Chapter 1", threshold: 50, type: "predictions", act: 1 },
  // Act II: Rising Power
  { id: "sentence-factory", name: "Sentence Factory", threshold: 65, type: "accuracy", act: 2, secondary: 25 },
  { id: "hot-streak-5", name: "Hot Streak 5", threshold: 5, type: "streak", act: 2 },
  { id: "century", name: "Century", threshold: 100, type: "predictions", act: 2 },
  { id: "eth-predictions", name: "ETH Predictions", threshold: 70, type: "accuracy", act: 2, secondary: 50 },
  { id: "speed-demon", name: "Speed Demon", threshold: 200, type: "predictions", act: 2 },
  { id: "story-chapter-2", name: "Chapter 2", threshold: 200, type: "predictions", act: 2 },
  // Act III: Community
  { id: "community-vote", name: "Community Vote", threshold: 100, type: "community", act: 3 },
  { id: "first-tweet", name: "First Tweet", threshold: 75, type: "accuracy", act: 3, secondary: 50 },
  { id: "tweet-storm", name: "Tweet Storm", threshold: 250, type: "community", act: 3 },
  { id: "story-chapter-3", name: "Chapter 3", threshold: 500, type: "community", act: 3 },
  // Act IV: The Arsenal
  { id: "solana-predictions", name: "Solana", threshold: 150, type: "wins", act: 4 },
  { id: "ripple-predictions", name: "Ripple", threshold: 200, type: "wins", act: 4 },
  { id: "cardano-predictions", name: "Cardano", threshold: 250, type: "wins", act: 4 },
  { id: "dogecoin-predictions", name: "Dogecoin", threshold: 300, type: "wins", act: 4 },
  { id: "story-chapter-4", name: "Chapter 4", threshold: 8, type: "coins", act: 4 },
  // Act V: Legendary
  { id: "legendary-status", name: "Legendary", threshold: 85, type: "accuracy", act: 5, secondary: 500 },
  { id: "the-impossible", name: "The Impossible", threshold: 95, type: "accuracy", act: 5, secondary: 1000 },
] as const;

type Catalog = typeof UNLOCK_CATALOG;
type Unlock = Catalog[number];

function evaluateUnlock(
  u: Unlock,
  stats: { winRate: number; totalPredictions: number; wins: number; streak: number },
  social: { followers: number; registeredUsers: number }
): { id: string; name: string; unlocked: boolean; progress: number; act: number } {
  let unlocked = false;
  let progress = 0;

  switch (u.type) {
    case "predictions":
      unlocked = stats.totalPredictions >= u.threshold;
      progress = Math.min(100, (stats.totalPredictions / u.threshold) * 100);
      break;
    case "streak":
      unlocked = stats.streak >= u.threshold;
      progress = Math.min(100, (stats.streak / u.threshold) * 100);
      break;
    case "accuracy": {
      const minPreds = ("secondary" in u ? u.secondary : 10) || 10;
      unlocked = stats.winRate >= u.threshold && stats.totalPredictions >= minPreds;
      const accP = Math.min(100, (stats.winRate / u.threshold) * 100);
      const predP = Math.min(100, (stats.totalPredictions / minPreds) * 100);
      progress = Math.min(accP, predP);
      break;
    }
    case "community":
      unlocked = social.registeredUsers >= u.threshold;
      progress = Math.min(100, (social.registeredUsers / u.threshold) * 100);
      break;
    case "wins":
      unlocked = stats.wins >= u.threshold;
      progress = Math.min(100, (stats.wins / u.threshold) * 100);
      break;
    case "coins":
      progress = 0; // Computed by checking other unlocks
      break;
  }

  return { id: u.id, name: u.name, unlocked, progress: Math.round(progress * 10) / 10, act: u.act };
}

export async function GET() {
  try {
    const locationId = DEFAULT_LOCATION;

    // Get latest stats
    const statsModel = PredictionStats(locationId);
    const statsResult = await statsModel.find().orderBy("date", "desc").limit(1).execute();
    const latest = statsResult.records[0];

    // Get social stats
    const socialModel = JaxSocialStats(locationId);
    const socialResult = await socialModel.find().orderBy("date", "desc").limit(1).execute();
    const social = socialResult.records[0];

    // Get earned unlocks
    const unlockModel = JaxUnlock(locationId);
    const earnedResult = await unlockModel.findAll(100);
    const earnedIds = new Set(earnedResult.records.map((r) => r.unlockId));

    const stats = {
      winRate: latest?.winRate || 0,
      totalPredictions: latest?.totalPredictions || 0,
      wins: latest?.wins || 0,
      streak: latest?.streak || 0,
    };

    const socialStats = {
      followers: social?.followers || 0,
      registeredUsers: 0,
    };

    const catalog = UNLOCK_CATALOG.map((u) => {
      const result = evaluateUnlock(u, stats, socialStats);
      return {
        ...result,
        earned: earnedIds.has(u.id),
      };
    });

    const unlockedCount = catalog.filter((u) => u.unlocked).length;

    return NextResponse.json({
      catalog,
      total: catalog.length,
      unlocked: unlockedCount,
      progress: Math.round((unlockedCount / catalog.length) * 100),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to evaluate unlocks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
