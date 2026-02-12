// JWT session management using jose (edge runtime compatible)

import { SignJWT, jwtVerify } from "jose";
import { config } from "@/lib/config";

export interface SessionPayload {
  sub: string; // contactId
  email: string;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(config.jwt.secret());
}

export async function createSession(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ sub: userId, email } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${config.jwt.expirySeconds}s`)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      sub: payload.sub as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function refreshSession(token: string): Promise<string | null> {
  const payload = await verifySession(token);
  if (!payload) return null;
  return createSession(payload.sub, payload.email);
}
