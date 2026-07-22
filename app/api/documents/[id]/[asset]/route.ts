import { NextResponse } from "next/server";
import { getSupabaseDataClient } from "@/lib/data/source";

type RouteContext = {
  params: Promise<{
    id: string;
    asset: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id, asset } = await context.params;

  if (asset !== "file" && asset !== "thumbnail") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { data, error } = await supabase
    .from("documents")
    .select("file_path, thumbnail_path, is_published")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const sourceUrl = asset === "file" ? data.file_path : data.thumbnail_path;

  if (!sourceUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstream = await fetch(sourceUrl, {
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Disposition": `inline; filename="${asset}-${id}"`,
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
    },
  });
}
