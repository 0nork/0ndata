import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(config.jwt.cookieName);
  return response;
}
