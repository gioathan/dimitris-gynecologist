import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createAdminClient();

  const { data: service, error } = await db
    .from("services")
    .insert([{
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      excerpt: body.excerpt ?? null,
      icon: body.icon ?? null,
      display_order: body.display_order ?? 0,
      is_published: body.is_published !== false,
      seo_title: body.seo_title ?? null,
      seo_description: body.seo_description ?? null,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.sections?.length) {
    await db.from("service_sections").insert(
      body.sections.map((s: any, i: number) => ({
        service_id: service.id,
        title: s.title,
        content: s.content ?? null,
        display_order: s.display_order ?? i,
      }))
    );
  }

  revalidateTag("services");
  return NextResponse.json(service);
}
