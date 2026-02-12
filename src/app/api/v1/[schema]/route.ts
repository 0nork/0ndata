import { NextRequest, NextResponse } from "next/server";
import { Model } from "@/lib/orm/model";
import { hasSchema } from "@/lib/schemas/registry";

// Register schemas on import
import "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

type RouteParams = { params: Promise<{ schema: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { schema } = await params;

  if (!hasSchema(schema)) {
    return NextResponse.json({ error: "Unknown schema" }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const cursor = searchParams.get("cursor") || undefined;
  const locationId = searchParams.get("locationId") || DEFAULT_LOCATION;

  const model = new Model(schema, locationId);
  const qb = model.find().limit(limit);
  if (cursor) qb.startAfter(cursor);

  const result = await qb.execute();

  return NextResponse.json({
    records: result.records,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { schema } = await params;

  if (!hasSchema(schema)) {
    return NextResponse.json({ error: "Unknown schema" }, { status: 404 });
  }

  const body = await request.json();
  const locationId = body.locationId || DEFAULT_LOCATION;
  delete body.locationId;

  const model = new Model(schema, locationId);
  const record = await model.create(body);

  return NextResponse.json({ record }, { status: 201 });
}
