// Token storage for CRM OAuth tokens
// Uses /tmp/ on Vercel serverless (ephemeral but works within warm instances)
// Falls back to home dir for local development

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

export interface StoredTokens {
  locationId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
}

// In-memory cache for serverless environments
const memoryCache: TokenMap = {};

// Use /tmp on Vercel (writable in serverless), home dir locally
const isVercel = !!process.env.VERCEL;
const TOKEN_DIR = isVercel ? "/tmp/.0ndata" : join(homedir(), ".0ndata");
const TOKEN_FILE = join(TOKEN_DIR, "tokens.json");

type TokenMap = Record<string, StoredTokens>;

async function readTokenFile(): Promise<TokenMap> {
  // Memory cache takes priority (survives within warm serverless instance)
  if (Object.keys(memoryCache).length > 0) return { ...memoryCache };

  try {
    const raw = await readFile(TOKEN_FILE, "utf-8");
    const data = JSON.parse(raw);
    // Populate memory cache
    Object.assign(memoryCache, data);
    return data;
  } catch {
    return {};
  }
}

async function writeTokenFile(data: TokenMap): Promise<void> {
  // Always update memory cache
  Object.assign(memoryCache, data);

  try {
    await mkdir(TOKEN_DIR, { recursive: true });
    await writeFile(TOKEN_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    // File write may fail on some serverless environments — memory cache still works
    console.warn("[0nData] Token file write failed, using memory cache:", err);
  }
}

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  const all = await readTokenFile();
  all[tokens.locationId] = tokens;
  await writeTokenFile(all);
  console.log(`[0nData] Tokens saved for location ${tokens.locationId}`);
}

export async function getTokens(
  locationId: string
): Promise<StoredTokens | null> {
  const all = await readTokenFile();
  return all[locationId] || null;
}

export async function deleteTokens(locationId: string): Promise<void> {
  const all = await readTokenFile();
  delete all[locationId];
  delete memoryCache[locationId];
  await writeTokenFile(all);
}

export async function listLocations(): Promise<string[]> {
  const all = await readTokenFile();
  return Object.keys(all);
}
