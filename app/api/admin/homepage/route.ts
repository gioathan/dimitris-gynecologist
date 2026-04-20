import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createAdminClient();

  const { data: existing } = await db.from("homepage_content").select("id").limit(1).single();

  const payload = {
    hero_title: body.hero_title ?? "",
    hero_subtitle: body.hero_subtitle ?? null,
    hero_image_url: body.hero_image_url ?? null,
    intro_text: body.intro_text ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await db.from("homepage_content").update(payload).eq("id", existing.id)
    : await db.from("homepage_content").insert([payload]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("homepage", "default");
  return NextResponse.json({ success: true });
}
