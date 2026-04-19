import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient()
    .from("articles")
    .insert([{
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      content: body.content ?? "",
      image_url: body.image_url ?? null,
      published_at: body.is_published ? (body.published_at || new Date().toISOString()) : null,
      is_published: body.is_published !== false,
      seo_title: body.seo_title ?? null,
      seo_description: body.seo_description ?? null,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("articles");
  return NextResponse.json(data);
}
