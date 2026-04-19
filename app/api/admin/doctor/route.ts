import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createAdminClient();

  const { data: existing } = await db.from("doctor").select("id").limit(1).single();

  const payload = {
    name: body.name ?? "",
    title: body.title ?? "",
    bio: body.bio ?? "",
    credentials: body.credentials ?? null,
    photo_url: body.photo_url ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await db.from("doctor").update(payload).eq("id", existing.id)
    : await db.from("doctor").insert([payload]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("doctor");
  return NextResponse.json({ success: true });
}
