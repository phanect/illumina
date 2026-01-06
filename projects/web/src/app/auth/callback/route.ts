import { Agent } from "@atproto/api";
import { NextResponse, type NextRequest } from "next/server";
import createBlueskyClient from "@/lib/atproto.ts";
import { createUser } from "@/lib/functions/create-user.ts";
import getSession from "@/lib/iron.ts";
import { prisma } from "@/lib/prisma.ts";

export async function GET(request: NextRequest) {
  const nextUrl = request.nextUrl;

  try {
    const blueskyClient = await createBlueskyClient(prisma);
    const { session } = await blueskyClient.callback(nextUrl.searchParams);
    const agent = new Agent(session);

    const { data } = await agent.getProfile({
      actor: session.did,
    });

    const ironSession = await getSession();
    ironSession.user = createUser(data);
    await ironSession.save();

    return NextResponse.redirect(`${ process.env.NEXT_PUBLIC_URL }/private`);
  } catch (e: unknown) {
    if (e instanceof Error) {
      // Bluesky error
      return NextResponse.redirect(
        `${ process.env.NEXT_PUBLIC_URL }/auth/login?error=${ e.message }`,
      );
    } else {
      // Unknown error
      return NextResponse.redirect(
        `${ process.env.NEXT_PUBLIC_URL }/auth/login?error=Unknown error`,
      );
    }
  }
}
