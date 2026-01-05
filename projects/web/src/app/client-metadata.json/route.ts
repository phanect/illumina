import { NextResponse } from "next/server";
import { blueskyClientMetadata } from "@/lib/atproto.ts";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(blueskyClientMetadata(), {
    status: 200,
  });
}
