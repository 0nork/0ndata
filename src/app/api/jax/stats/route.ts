import { NextResponse } from "next/server";
import { PredictionStats, Prediction } from "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

export async function GET() {
  try {
    const locationId = DEFAULT_LOCATION;

    // Get latest prediction stats
    const statsModel = PredictionStats(locationId);
    const statsResult = await statsModel
      .find()
      .orderBy("date", "desc")
      .limit(1)
      .execute();

    const latestStats = statsResult.records[0];

    // Get total prediction count
    const predictionsModel = Prediction(locationId);
    const allPreds = await predictionsModel.find().limit(1).execute();

    return NextResponse.json({
      winRate: latestStats?.winRate || 0,
      totalPredictions: latestStats?.totalPredictions || 0,
      wins: latestStats?.wins || 0,
      losses: latestStats?.losses || 0,
      currentStreak: latestStats?.streak || 0,
      intervalMinutes: latestStats?.intervalMinutes || 60,
      hasData: !!latestStats,
      hasPredictions: allPreds.records.length > 0,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
