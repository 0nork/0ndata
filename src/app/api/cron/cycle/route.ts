import { NextRequest, NextResponse } from "next/server";
import {
  Prediction,
  PredictionStats,
  JaxUnlock,
  JaxSentence,
  JaxConfig,
  type PredictionRecord,
} from "@/models/index";

const LOCATION_ID = process.env.CRM_LOCATION_ID || "";
const JAX_API = process.env.JAX_API_URL || "https://www.jaxxai.com";
const CRON_SECRET = process.env.CRON_SECRET || "";

// Unlock → Config upgrade map
const UPGRADE_MAP: Record<string, Record<string, string | number>> = {
  "first-sentence": { enabledFeatures: "predictions,sentences" },
  "double-down": { predictionInterval: 12 },
  "hot-streak-5": { enabledCoins: "BTC,ETH,SOL,DOGE" },
  "century": { predictionInterval: 10 },
  "eth-predictions": { activeModels: "gpt4,claude,gemini,deepseek" },
  "speed-demon": { predictionInterval: 5, enabledCoins: "BTC,ETH,SOL,DOGE,ADA,AVAX" },
  "solana-predictions": { enabledFeatures: "predictions,sentences,analysis" },
  "ripple-predictions": { predictionInterval: 3, enabledCoins: "BTC,ETH,SOL,DOGE,ADA,AVAX,LINK,DOT,MATIC,UNI" },
  "cardano-predictions": { enabledFeatures: "predictions,sentences,analysis,social" },
  "legendary-status": { autonomousMode: "full" },
  "the-impossible": { predictionInterval: 1, enabledFeatures: "predictions,sentences,analysis,social,trading" },
};

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel cron or manual call)
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  const push = (msg: string) => { log.push(`[${new Date().toISOString()}] ${msg}`); };

  try {
    push("Starting JAX cycle");

    // 1. Read config
    const configModel = JaxConfig(LOCATION_ID);
    const configResult = await configModel.findAll(1);
    const cfg = configResult.records[0] || {
      enabledCoins: "BTC,ETH,SOL",
      activeModels: "gpt4,claude,gemini",
      predictionInterval: 15,
    };
    const coins = (cfg.enabledCoins || "BTC,ETH,SOL").split(",").map((c: string) => c.trim());
    push(`Config loaded: ${coins.length} coins, interval=${cfg.predictionInterval}min`);

    // 2. Run predictions for each coin
    const predModel = Prediction(LOCATION_ID);
    const newPredictions: (PredictionRecord & { id: string })[] = [];

    for (const coin of coins) {
      try {
        const res = await fetch(`${JAX_API}/api/crypto/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coin, source: "0ndata-cron" }),
        });

        if (res.ok) {
          const data = await res.json();
          const record = await predModel.create({
            coin: data.coin || data.symbol || coin,
            direction: data.direction || data.prediction || "UP",
            confidence: data.confidence || 0,
            modelsUsed: Array.isArray(data.models) ? data.models.join(",") : String(data.modelsUsed || ""),
            entryPrice: data.entryPrice || data.entry_price || 0,
            targetPrice: data.targetPrice || data.target_price || 0,
            result: "PENDING",
            verifiedAt: "",
            cycleNumber: data.cycleNumber || data.cycle_number || 0,
          });
          newPredictions.push(record);
          push(`Prediction: ${coin} ${data.direction || data.prediction} @ ${data.confidence}% conf`);
        } else {
          push(`Prediction SKIP: ${coin} — ${res.status}`);
        }
      } catch (err) {
        push(`Prediction ERROR: ${coin} — ${err instanceof Error ? err.message : "unknown"}`);
      }
    }

    // 3. Verify old pending predictions
    const pendingResult = await predModel.find().eq("result", "PENDING").limit(50).execute();
    let wins = 0;
    let losses = 0;

    for (const record of pendingResult.records) {
      const rec = record as PredictionRecord & { id: string };
      if (newPredictions.some((p) => p.id === rec.id)) continue; // skip just-created

      try {
        const priceRes = await fetch(`${JAX_API}/api/crypto/price?coin=${rec.coin}`);
        if (!priceRes.ok) continue;
        const priceData = await priceRes.json();
        const currentPrice = priceData.price || priceData.currentPrice || 0;
        if (!currentPrice) continue;

        const entry = Number(rec.entryPrice) || 0;
        const target = Number(rec.targetPrice) || 0;
        const dir = (rec.direction || "").toUpperCase();

        let result = "PENDING";
        if (dir === "UP" && currentPrice >= target) result = "WIN";
        else if (dir === "UP" && currentPrice < entry * 0.97) result = "LOSS";
        else if (dir === "DOWN" && currentPrice <= target) result = "WIN";
        else if (dir === "DOWN" && currentPrice > entry * 1.03) result = "LOSS";

        if (result !== "PENDING") {
          await predModel.update(rec.id, { result, verifiedAt: new Date().toISOString() });
          if (result === "WIN") wins++;
          else losses++;
          push(`Verified: ${rec.coin} → ${result}`);
        }
      } catch {
        // skip
      }
    }

    // 4. Update stats
    const statsModel = PredictionStats(LOCATION_ID);
    const existingStats = await statsModel.find().orderBy("date", "desc").limit(1).execute();
    const prev = existingStats.records[0];
    const totalWins = (prev?.wins || 0) + wins;
    const totalLosses = (prev?.losses || 0) + losses;
    const totalPredictions = (prev?.totalPredictions || 0) + newPredictions.length;
    const winRate = (totalWins + totalLosses) > 0
      ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
      : 0;

    const today = new Date().toISOString().split("T")[0];
    await statsModel.create({
      date: today,
      winRate,
      totalPredictions,
      wins: totalWins,
      losses: totalLosses,
      streak: wins > 0 ? (prev?.streak || 0) + wins : 0,
      intervalMinutes: Number(cfg.predictionInterval) || 15,
    });
    push(`Stats: ${winRate}% win rate, ${totalPredictions} total, +${wins}W/${losses}L this cycle`);

    // 5. Check unlocks
    const unlockModel = JaxUnlock(LOCATION_ID);
    const earnedResult = await unlockModel.findAll(100);
    const earnedIds = new Set(earnedResult.records.map((r) => r.unlockId));

    // Fetch unlock status from JAX bot
    let newUnlockIds: string[] = [];
    try {
      const unlockRes = await fetch(`${JAX_API}/api/jax/unlocks`);
      if (unlockRes.ok) {
        const unlockData = await unlockRes.json();
        const catalog = unlockData.catalog || unlockData.unlocks || [];
        const newlyUnlocked = catalog.filter(
          (u: { id: string; unlocked: boolean }) => u.unlocked && !earnedIds.has(u.id)
        );

        for (const u of newlyUnlocked) {
          await unlockModel.create({
            unlockId: u.id,
            unlockedAt: new Date().toISOString(),
            triggeredBy: "cron-cycle",
            notificationSent: false,
          });
          newUnlockIds.push(u.id);
          push(`UNLOCK: ${u.name || u.id}`);

          // Apply config upgrade if mapped
          const upgrade = UPGRADE_MAP[u.id];
          if (upgrade && configResult.records[0]) {
            const configId = (configResult.records[0] as unknown as { id: string }).id;
            await configModel.update(configId, upgrade as Partial<typeof cfg>);
            push(`CONFIG UPGRADE: ${Object.keys(upgrade).join(", ")}`);
          }
        }
      }
    } catch {
      push("Could not check unlocks from JAX bot");
    }

    // 6. Grab latest sentence
    try {
      const sentRes = await fetch(`${JAX_API}/api/jax/sentences?limit=1`);
      if (sentRes.ok) {
        const sentData = await sentRes.json();
        const sentences = sentData.sentences || [];
        if (sentences.length > 0) {
          const s = sentences[0];
          const sentModel = JaxSentence(LOCATION_ID);
          await sentModel.create({
            text: s.text || s.content || "",
            cycleNumber: s.cycleNumber || 0,
            modelsUsed: s.modelsUsed || "",
            emotion: s.emotion || "",
            context: "cron-cycle",
          });
          push(`Sentence saved: "${(s.text || "").substring(0, 50)}..."`);
        }
      }
    } catch {
      push("Could not fetch sentences");
    }

    push("Cycle complete");

    return NextResponse.json({
      ok: true,
      predictions: newPredictions.length,
      verified: { wins, losses },
      stats: { winRate, totalPredictions },
      newUnlocks: newUnlockIds,
      log,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cycle failed";
    push(`FATAL: ${message}`);
    return NextResponse.json({ ok: false, error: message, log }, { status: 500 });
  }
}
