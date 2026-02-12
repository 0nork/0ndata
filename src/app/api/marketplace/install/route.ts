import { NextResponse } from "next/server";
import { getAuthorizationUrl, generateState } from "@/lib/bridge/oauth";

export async function GET() {
  const state = generateState();
  const url = getAuthorizationUrl(state);
  return NextResponse.redirect(url);
}
