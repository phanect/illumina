"use server";

import createBlueskyClient from "@/lib/atproto";
import getSession from "@/lib/iron";
import { prisma } from "@/lib/prisma.ts";

/**
 * Prepare to login with Bluesky and return Bluesky login URL
 * @param handle - Bluesky handle
 * @returns Login URL of Bluesky
 */
export async function loginWithBluesky(handle: string): Promise<string> {
  const blueskyClient = await createBlueskyClient(prisma);
  const blueskyLoginURL: URL = await blueskyClient.authorize(handle);

  return blueskyLoginURL.toString();
}

export async function signOut(): Promise<void> {
  const session = await getSession();

  session.destroy();
}
