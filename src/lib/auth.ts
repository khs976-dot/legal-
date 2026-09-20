import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
const SESSION_DAYS = 7;

function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.trim().length === 0) {
    return null;
  }
  return password;
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword() !== null;
}

export function verifyAdminPassword(candidate: string): boolean {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }
  const left = Buffer.from(candidate);
  const right = Buffer.from(password);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createSessionToken(): string {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = createHmac("sha256", password).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const password = getAdminPassword();
  if (!password || !token) {
    return false;
  }
  const [payload, sig] = token.split(".");
  if (!payload || !sig) {
    return false;
  }
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return false;
  }
  const expected = createHmac("sha256", password).update(payload).digest("hex");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
