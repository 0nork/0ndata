import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth/contacts";
import { createSession } from "@/lib/auth/sessions";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user in CRM
    const user = await createUser(email, password, name);

    // Create JWT session
    const token = await createSession(user.contactId, user.email);

    const response = NextResponse.json({
      user: {
        id: user.contactId,
        email: user.email,
        name,
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
    const message = err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
