// CRM OAuth 2.0 flow — reuses patterns from 0n-marketplace/lib/crm-oauth.ts

import { config } from "@/lib/config";
import { saveTokens, getTokens, type StoredTokens } from "./tokens";

export interface CRMTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  userType: string;
  locationId?: string;
  companyId?: string;
  userId?: string;
}

const REQUIRED_SCOPES = [
  "contacts.readonly",
  "contacts.write",
  "objects/schema.readonly",
  "objects/schema.write",
  "objects/record.readonly",
  "objects/record.write",
  "locations.readonly",
  "locations/customFields.readonly",
  "locations/customFields.write",
];

// CSRF state store (in-memory, fine for single-process)
const stateStore = new Map<string, { expiresAt: number }>();

export function generateState(): string {
  const state = crypto.randomUUID();
  stateStore.set(state, { expiresAt: Date.now() + 10 * 60 * 1000 });
  // Cleanup expired
  for (const [key, value] of stateStore.entries()) {
    if (value.expiresAt < Date.now()) stateStore.delete(key);
  }
  return state;
}

export function validateState(state: string): boolean {
  const stored = stateStore.get(state);
  if (!stored || stored.expiresAt < Date.now()) {
    stateStore.delete(state);
    return false;
  }
  stateStore.delete(state);
  return true;
}

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.crm.clientId(),
    redirect_uri: config.crm.redirectUri(),
    response_type: "code",
    scope: REQUIRED_SCOPES.join(" "),
    state,
  });
  return `${config.crm.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string
): Promise<CRMTokenResponse> {
  const response = await fetch(config.crm.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: config.crm.clientId(),
      client_secret: config.crm.clientSecret(),
      grant_type: "authorization_code",
      code,
      redirect_uri: config.crm.redirectUri(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<CRMTokenResponse> {
  const response = await fetch(config.crm.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: config.crm.clientId(),
      client_secret: config.crm.clientSecret(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/** Get a valid access token for a location, auto-refreshing if needed */
export async function getValidAccessToken(
  locationId: string
): Promise<string | null> {
  // PIT token fallback — used by cron jobs and internal API routes
  const pit = process.env.CRM_PIT_TOKEN;

  const stored = await getTokens(locationId);
  if (!stored) return pit || null;

  const BUFFER_MS = 5 * 60 * 1000; // 5 minute buffer

  if (stored.expiresAt - Date.now() < BUFFER_MS) {
    try {
      const newTokens = await refreshAccessToken(stored.refreshToken);
      const updated: StoredTokens = {
        locationId,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        expiresAt: Date.now() + newTokens.expires_in * 1000,
      };
      await saveTokens(updated);
      return updated.accessToken;
    } catch {
      return null;
    }
  }

  return stored.accessToken;
}
