import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createAdminClient();

  const upserts = Object.entries(body).map(([key, value]) => ({ key, value: String(value ?? "") }));
  const { error } = await db.from("site_settings").upsert(upserts, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("site_settings");
  return NextResponse.json({ success: true });
}
