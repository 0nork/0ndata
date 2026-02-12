// File-based token storage for CRM OAuth tokens
// In production/Marketplace: tokens come from CRM OAuth install flow

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

export interface StoredTokens {
  locationId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
}

const TOKEN_DIR = join(homedir(), ".0ndata");
const TOKEN_FILE = join(TOKEN_DIR, "tokens.json");

type TokenMap = Record<string, StoredTokens>;

async function readTokenFile(): Promise<TokenMap> {
  try {
    const raw = await readFile(TOKEN_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeTokenFile(data: TokenMap): Promise<void> {
  await mkdir(TOKEN_DIR, { recursive: true });
  await writeFile(TOKEN_FILE, JSON.stringify(data, null, 2));
}

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  const all = await readTokenFile();
  all[tokens.locationId] = tokens;
  await writeTokenFile(all);
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
  await writeTokenFile(all);
}

export async function listLocations(): Promise<string[]> {
  const all = await readTokenFile();
  return Object.keys(all);
}
