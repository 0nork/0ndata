import { NextRequest, NextResponse } from "next/server";
import { verifyUserPassword } from "@/lib/auth/contacts";
import { createSession } from "@/lib/auth/sessions";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyUserPassword(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSession(user.contactId, user.email);

    const response = NextResponse.json({
      user: {
        id: user.contactId,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set(config.jwt.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: config.jwt.expirySeconds,
      path: "/",
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signin failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
