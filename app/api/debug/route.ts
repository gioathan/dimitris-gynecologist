import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = createPublicClient();
  const { data, error } = await db.from("services").select("id, title, is_published");
  return NextResponse.json({ data, error });
}

// POST /api/debug  → purge all public caches
export async function POST() {
  const tags = ["homepage", "doctor", "services", "articles", "site_settings", "clinic_images"];
  tags.forEach((tag) => revalidateTag(tag, "default"));
  return NextResponse.json({ revalidated: tags });
}
