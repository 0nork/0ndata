// Typed CRM API client with rate limiting and usage tracking

import { config } from "@/lib/config";
import { rateLimiter } from "./rate-limiter";
import { getValidAccessToken } from "./oauth";
import { tracker } from "@/lib/usage/tracker";

export interface CRMRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  locationId: string;
}

export interface CRMResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

export async function crmRequest<T = unknown>(
  options: CRMRequestOptions
): Promise<CRMResponse<T>> {
  const { method = "GET", path, body, query, locationId } = options;

  // Rate limiting
  await rateLimiter.acquire();

  // Get valid access token
  const accessToken = await getValidAccessToken(locationId);
  if (!accessToken) {
    throw new Error(`No valid access token for location: ${locationId}`);
  }

  // Build URL with query params
  const url = new URL(`${config.crm.baseUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  // Make request
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Version: config.crm.apiVersion,
    Accept: "application/json",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Track usage
  if (config.usage.enabled()) {
    tracker.increment(locationId);
  }

  // Handle 429 with backoff (handled by rate limiter mostly, but just in case)
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return crmRequest(options); // Retry once
  }

  const data = response.ok ? await response.json() : await response.text();

  return {
    ok: response.ok,
    status: response.status,
    data: data as T,
  };
}
