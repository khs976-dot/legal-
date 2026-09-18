import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContent, githubPersistConfigured, saveContent } from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getContent();
  return NextResponse.json({
    content,
    githubPersist: githubPersistConfigured(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { content?: SiteContent }
    | null;

  if (!body?.content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  try {
    const result = await saveContent(body.content);
    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
    revalidatePath("/about");
    revalidatePath("/practice");
    revalidatePath("/contact");
    revalidatePath("/en/about");
    revalidatePath("/en/practice");
    revalidatePath("/en/contact");
    return NextResponse.json({
      ok: true,
      persist: result.persist,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
