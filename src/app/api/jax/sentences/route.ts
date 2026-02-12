import { NextRequest, NextResponse } from "next/server";
import { JaxSentence } from "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const cursor = searchParams.get("cursor") || undefined;
    const locationId = DEFAULT_LOCATION;

    const model = JaxSentence(locationId);
    const qb = model.find().orderBy("cycle_number", "desc").limit(limit);
    if (cursor) qb.startAfter(cursor);

    const result = await qb.execute();

    return NextResponse.json({
      sentences: result.records,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch sentences";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
