import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { error } = await createAdminClient()
    .from("articles")
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      content: body.content ?? "",
      image_url: body.image_url ?? null,
      published_at: body.is_published ? (body.published_at || new Date().toISOString()) : null,
      is_published: body.is_published !== false,
      seo_title: body.seo_title ?? null,
      seo_description: body.seo_description ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("articles");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = createAdminClient();

  const { data: article } = await db.from("articles").select("image_url").eq("id", id).single();
  if (article?.image_url) {
    const path = article.image_url.split("/storage/v1/object/public/dimitris-gynecologist/")[1];
    if (path) await db.storage.from("dimitris-gynecologist").remove([path]);
  }

  const { error } = await db.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("articles");
  return NextResponse.json({ success: true });
}
