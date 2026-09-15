import { NextResponse } from "next/server";
import { getActiveDealers } from "@/lib/data/dealers";

export async function GET() {
  const dealers = await getActiveDealers();
  return NextResponse.json({ dealers });
}
