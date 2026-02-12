// Centralized environment config with validation

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const config = {
  crm: {
    clientId: () => required("CRM_CLIENT_ID"),
    clientSecret: () => required("CRM_CLIENT_SECRET"),
    redirectUri: () =>
      optional(
        "CRM_REDIRECT_URI",
        `${optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}/api/marketplace/callback`
      ),
    baseUrl: "https://services.leadconnectorhq.com",
    apiVersion: "2021-07-28",
    authUrl:
      "https://marketplace.leadconnectorhq.com/oauth/chooselocation",
    tokenUrl: "https://services.leadconnectorhq.com/oauth/token",
  },
  jwt: {
    secret: () => required("JWT_SECRET"),
    cookieName: "0ndata-session",
    expirySeconds: 86400, // 24h
  },
  app: {
    url: () => optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },
  usage: {
    enabled: () => optional("USAGE_TRACKING_ENABLED", "true") === "true",
  },
} as const;
