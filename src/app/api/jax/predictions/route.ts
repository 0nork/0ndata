import { NextRequest, NextResponse } from "next/server";
import { Prediction } from "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const cursor = searchParams.get("cursor") || undefined;
    const locationId = DEFAULT_LOCATION;

    const model = Prediction(locationId);
    const qb = model.find().orderBy("cycle_number", "desc").limit(limit);
    if (cursor) qb.startAfter(cursor);

    const result = await qb.execute();

    return NextResponse.json({
      predictions: result.records,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch predictions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locationId = DEFAULT_LOCATION;

    const model = Prediction(locationId);
    const record = await model.create(body);

    return NextResponse.json({ prediction: record }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create prediction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
