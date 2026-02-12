import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/sessions";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(config.jwt.cookieName)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.sub,
      email: session.email,
    },
  });
}
