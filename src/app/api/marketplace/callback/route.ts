import { NextRequest, NextResponse } from "next/server";
import {
  validateState,
  exchangeCodeForTokens,
} from "@/lib/bridge/oauth";
import { saveTokens } from "@/lib/bridge/tokens";
import { installSchemas } from "@/lib/schemas/installer";

// Register JAX schemas before installation
import "@/models/index";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state parameter" },
      { status: 400 }
    );
  }

  // Validate CSRF state
  if (!validateState(state)) {
    return NextResponse.json(
      { error: "Invalid or expired state parameter" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const locationId = tokens.locationId || tokens.companyId || "";

    if (!locationId) {
      return NextResponse.json(
        { error: "No location ID returned from OAuth" },
        { status: 400 }
      );
    }

    // Save tokens
    await saveTokens({
      locationId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });

    // Install JAX schemas for this location
    const report = await installSchemas(locationId);
    console.log("Schema install report:", JSON.stringify(report));

    // Redirect to settings/dashboard
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/settings?installed=true`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OAuth callback failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
