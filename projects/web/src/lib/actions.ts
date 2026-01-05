"use server";

import createBlueskyClient from "@/lib/atproto";
import getSession from "@/lib/iron";
import { prisma } from "@/lib/prisma";

export async function loginWithBluesky(handle: string): Promise<string> {
  const blueskyClient = await createBlueskyClient(prisma);
  const blueskyLoginURL: URL = await blueskyClient.authorize(handle);

  return blueskyLoginURL.toString();
}

export async function signOut(): Promise<void> {
  const session = await getSession();

  session.destroy();
}
