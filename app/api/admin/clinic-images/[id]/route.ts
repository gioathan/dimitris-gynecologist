import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = createAdminClient();

  const { data: image } = await db.from("clinic_images").select("url").eq("id", id).single();

  if (image?.url) {
    const path = image.url.split("/storage/v1/object/public/dimitris-gynecologist/")[1];
    if (path) await db.storage.from("dimitris-gynecologist").remove([path]);
  }

  const { error } = await db.from("clinic_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("clinic_images", "default");
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { error } = await createAdminClient()
    .from("clinic_images")
    .update({ alt: body.alt, display_order: body.display_order })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("clinic_images", "default");
  return NextResponse.json({ success: true });
}
