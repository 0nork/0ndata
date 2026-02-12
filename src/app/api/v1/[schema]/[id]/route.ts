import { NextRequest, NextResponse } from "next/server";
import { Model } from "@/lib/orm/model";
import { hasSchema } from "@/lib/schemas/registry";

// Register schemas on import
import "@/models/index";

const DEFAULT_LOCATION = process.env.CRM_LOCATION_ID || "";

type RouteParams = { params: Promise<{ schema: string; id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { schema, id } = await params;

  if (!hasSchema(schema)) {
    return NextResponse.json({ error: "Unknown schema" }, { status: 404 });
  }

  const locationId =
    request.nextUrl.searchParams.get("locationId") || DEFAULT_LOCATION;
  const model = new Model(schema, locationId);
  const record = await model.findById(id);

  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { schema, id } = await params;

  if (!hasSchema(schema)) {
    return NextResponse.json({ error: "Unknown schema" }, { status: 404 });
  }

  const body = await request.json();
  const locationId = body.locationId || DEFAULT_LOCATION;
  delete body.locationId;

  const model = new Model(schema, locationId);
  const record = await model.update(id, body);

  return NextResponse.json({ record });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { schema, id } = await params;

  if (!hasSchema(schema)) {
    return NextResponse.json({ error: "Unknown schema" }, { status: 404 });
  }

  const locationId =
    request.nextUrl.searchParams.get("locationId") || DEFAULT_LOCATION;
  const model = new Model(schema, locationId);
  const success = await model.delete(id);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
