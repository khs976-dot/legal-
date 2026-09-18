import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const TMP_PATH = path.join("/tmp", "alsmairi-site-content.json");

export type PersistMode = "file" | "github" | "ephemeral";

let memoryCache: SiteContent | null = null;

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Partial<SiteContent>;
  return Boolean(
    record.identity &&
      record.hero &&
      record.bio &&
      Array.isArray(record.practiceAreas) &&
      record.contact &&
      record.social &&
      record.cta,
  );
}

async function readJsonFile(filePath: string): Promise<SiteContent | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return isSiteContent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  if (memoryCache) {
    return memoryCache;
  }

  const fromTmp = await readJsonFile(TMP_PATH);
  if (fromTmp) {
    memoryCache = fromTmp;
    return fromTmp;
  }

  const fromRepo = await readJsonFile(CONTENT_PATH);
  if (!fromRepo) {
    throw new Error("Unable to read content/site.json");
  }
  return fromRepo;
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
  if (!isSiteContent(content)) {
    throw new Error("Invalid site content");
  }

  memoryCache = content;
  const json = `${JSON.stringify(content, null, 2)}\n`;

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
