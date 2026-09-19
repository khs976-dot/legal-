import { promises as fs } from "fs";
import path from "path";
import { connection } from "next/server";
import { mergeCopy } from "./copy";
import type { Chip, Highlight, SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const TMP_PATH = path.join("/tmp", "alsmairi-site-content.json");

export type PersistMode = "file" | "github" | "ephemeral";

let memoryCache: SiteContent | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function stringField(
  record: Record<string, unknown> | null,
  key: string,
  fallback = "",
): string {
  const value = record?.[key];
  return typeof value === "string" ? value : fallback;
}

function normalizeList<T>(
  value: unknown,
  mapItem: (item: Record<string, unknown>, index: number) => T,
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item, index) => {
      const record = asRecord(item);
      return record ? mapItem(record, index) : null;
    })
    .filter((item): item is T => item !== null);
}

function chipsFromLegacy(record: Record<string, unknown>): Chip[] {
  const practice = normalizeList<Chip>(record.practiceAreas, (item, index) => ({
    id: stringField(item, "id", `chip-${index + 1}`),
    labelAr: stringField(item, "titleAr"),
    labelEn: stringField(item, "titleEn"),
  }));
  return practice.slice(0, 4);
}

export function normalizeContent(raw: unknown): SiteContent {
  const record = asRecord(raw) ?? {};
  const identity = asRecord(record.identity);
  const hero = asRecord(record.hero);
  const bio = asRecord(record.bio);
  const contact = asRecord(record.contact);
  const cta = asRecord(record.cta);

  let chips = normalizeList<Chip>(record.chips, (item, index) => ({
    id: stringField(item, "id", `chip-${index + 1}`),
    labelAr: stringField(item, "labelAr"),
    labelEn: stringField(item, "labelEn"),
  }));
  if (chips.length === 0) {
    chips = chipsFromLegacy(record);
  }

  return {
    identity: {
      nameAr: stringField(identity, "nameAr"),
      nameEn: stringField(identity, "nameEn"),
      shortNameAr: stringField(identity, "shortNameAr"),
      shortNameEn: stringField(identity, "shortNameEn"),
      monogram: stringField(identity, "monogram", "KA"),
      titleAr: stringField(identity, "titleAr"),
      titleEn: stringField(identity, "titleEn"),
      locationAr: stringField(identity, "locationAr"),
      locationEn: stringField(identity, "locationEn"),
    },
    hero: {
      eyebrowAr: stringField(hero, "eyebrowAr"),
      eyebrowEn: stringField(hero, "eyebrowEn"),
      headlineAr: stringField(hero, "headlineAr"),
      headlineEn: stringField(hero, "headlineEn"),
      subheadlineAr: stringField(hero, "subheadlineAr"),
      subheadlineEn: stringField(hero, "subheadlineEn"),
    },
    bio: {
      shortAr: stringField(bio, "shortAr", stringField(bio, "longAr")),
      shortEn: stringField(bio, "shortEn", stringField(bio, "longEn")),
    },
    chips,
    highlights: normalizeList<Highlight>(record.highlights, (item, index) => ({
      id: stringField(item, "id", `highlight-${index + 1}`),
      titleAr: stringField(item, "titleAr"),
      titleEn: stringField(item, "titleEn"),
      textAr: stringField(item, "textAr"),
      textEn: stringField(item, "textEn"),
    })),
    cta: {
      labelAr: stringField(cta, "labelAr"),
      labelEn: stringField(cta, "labelEn"),
      textAr: stringField(cta, "textAr"),
      textEn: stringField(cta, "textEn"),
    },
    contact: {
      email: stringField(contact, "email"),
      phone: stringField(contact, "phone"),
      addressAr: stringField(contact, "addressAr"),
      addressEn: stringField(contact, "addressEn"),
      formspreeEndpoint: stringField(contact, "formspreeEndpoint"),
    },
    copy: mergeCopy(asRecord(record.copy) as Partial<SiteContent["copy"]>),
  };
}

function isSiteContent(value: unknown): boolean {
  const record = asRecord(value);
  return Boolean(record && asRecord(record.identity) && asRecord(record.hero));
}

async function readJsonFile(
  filePath: string,
): Promise<{ content: SiteContent; mtime: number } | null> {
  try {
    const [raw, stat] = await Promise.all([
      fs.readFile(filePath, "utf8"),
      fs.stat(filePath),
    ]);
    const parsed = JSON.parse(raw) as unknown;
    return isSiteContent(parsed)
      ? { content: normalizeContent(parsed), mtime: stat.mtimeMs }
      : null;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  await connection();
  const [fromRepo, fromTmp] = await Promise.all([
    readJsonFile(CONTENT_PATH),
    readJsonFile(TMP_PATH),
  ]);

  const newest = [fromRepo, fromTmp]
    .filter((entry): entry is { content: SiteContent; mtime: number } =>
      Boolean(entry),
    )
    .sort((left, right) => right.mtime - left.mtime)[0];

  if (newest) {
    memoryCache = newest.content;
    return newest.content;
  }

  if (memoryCache) {
    return memoryCache;
  }

  throw new Error("Unable to read content/site.json");
}

async function saveToGithub(json: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error("GitHub persistence is not configured");
  }

  const apiPath = `https://api.github.com/repos/${repo}/contents/content/site.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const existing = await fetch(`${apiPath}?ref=${encodeURIComponent(branch)}`, {
    headers,
    cache: "no-store",
  });

  let sha: string | undefined;
  if (existing.ok) {
    const data = (await existing.json()) as { sha?: string };
    sha = data.sha;
  }

  const put = await fetch(apiPath, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update site content from the admin dashboard",
      content: Buffer.from(json).toString("base64"),
      branch,
      sha,
    }),
  });

  if (!put.ok) {
    const detail = await put.text();
    throw new Error(`GitHub persist failed (${put.status}): ${detail}`);
  }
}

export async function saveContent(
  content: SiteContent,
): Promise<{ persist: PersistMode }> {
  const normalized = normalizeContent(content);
  memoryCache = normalized;
  const json = `${JSON.stringify(normalized, null, 2)}\n`;

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await saveToGithub(json);
    try {
      await fs.writeFile(CONTENT_PATH, json, "utf8");
    } catch {
      /* read-only on Vercel */
    }
    try {
      await fs.writeFile(TMP_PATH, json, "utf8");
    } catch {
      /* ignore */
    }
    return { persist: "github" };
  }

  try {
    await fs.writeFile(CONTENT_PATH, json, "utf8");
    try {
      await fs.writeFile(TMP_PATH, json, "utf8");
    } catch {
      /* ignore */
    }
    return { persist: "file" };
  } catch {
    try {
      await fs.writeFile(TMP_PATH, json, "utf8");
    } catch {
      /* ignore */
    }
    return { persist: "ephemeral" };
  }
}

export function githubPersistConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}
