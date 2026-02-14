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

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }

  // Validate CSRF state only if present (marketplace installs skip state)
  if (state && !validateState(state)) {
    return NextResponse.json(
      { error: "Invalid or expired state parameter" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const locationId = tokens.locationId || tokens.companyId || "";

    console.log("[0nData] OAuth callback — locationId:", locationId);
    console.log("[0nData] Token scopes:", tokens.scope);

    if (!locationId) {
      return NextResponse.json(
        { error: "No location ID returned from OAuth" },
        { status: 400 }
      );
    }

    // Save tokens (file-based + /tmp fallback for serverless)
    try {
      await saveTokens({
        locationId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      });
    } catch (saveErr) {
      // Token save may fail on serverless — log but continue
      console.warn("[0nData] Token save warning:", saveErr);
    }

    // Install JAX schemas for this location
    let report;
    try {
      report = await installSchemas(locationId);
      console.log("[0nData] Schema install report:", JSON.stringify(report));
    } catch (schemaErr) {
      console.error("[0nData] Schema install error:", schemaErr);
      // Continue to redirect — schemas can be installed later
    }

    // Redirect to settings/dashboard
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams({
      installed: "true",
      location: locationId,
    });
    if (report) {
      params.set("created", String(report.created.length));
      params.set("skipped", String(report.skipped.length));
    }
    return NextResponse.redirect(`${appUrl}/settings?${params.toString()}`);
  } catch (err) {
    console.error("[0nData] OAuth callback error:", err);
    const message =
      err instanceof Error ? err.message : "OAuth callback failed";
    // Redirect to settings with error instead of JSON response
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${appUrl}/settings?error=${encodeURIComponent(message)}`
    );
  }
}
