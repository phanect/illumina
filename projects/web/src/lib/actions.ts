"use server";

import createBlueskyClient from "@/lib/atproto";
import getSession from "@/lib/iron";
import { prisma } from "@/lib/prisma";

export async function signInWithBluesky(handle: string): Promise<string> {
  const blueskyClient = await createBlueskyClient(prisma);

  // Get the URL to authorize the user
  const url: URL = await blueskyClient.authorize(handle);

  // Return the URL
  return url.toString();
}

export async function signOut(): Promise<void> {
  const session = await getSession();

  session.destroy();
}
