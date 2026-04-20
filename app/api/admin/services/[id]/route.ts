import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const db = createAdminClient();

  const { error } = await db.from("services").update({
    title: body.title,
    slug: body.slug,
    description: body.description ?? null,
    excerpt: body.excerpt ?? null,
    icon: body.icon ?? null,
    display_order: body.display_order ?? 0,
    is_published: body.is_published !== false,
    seo_title: body.seo_title ?? null,
    seo_description: body.seo_description ?? null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await db.from("service_sections").delete().eq("service_id", id);
  if (body.sections?.length) {
    await db.from("service_sections").insert(
      body.sections.map((s: any, i: number) => ({
        service_id: id,
        title: s.title,
        content: s.content ?? null,
        display_order: s.display_order ?? i,
      }))
    );
  }

  revalidateTag("services", "default");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await createAdminClient().from("services").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("services", "default");
  return NextResponse.json({ success: true });
}
