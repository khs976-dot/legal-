import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminPasswordConfigured,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function tooMany(key: string): boolean {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now > current.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ error: "—" }, { status: 503 });
  }

  if (tooMany(clientKey(request))) {
    return NextResponse.json({ error: "—" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { password?: string }
    | null;
  const password = body?.password ?? "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "—" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createSessionToken(),
    sessionCookieOptions(),
  );
  return response;
}
