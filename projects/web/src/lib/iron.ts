"use server";

import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { User } from "@/functions/create-user.ts";

export type Session = {
  user: User | null;
};

const getSession = async (): Promise<IronSession<Session>> => {
  if (!process.env.COOKIE_PASSWORD) {
    throw new Error("`COOKIE_PASSWORD` is not set. Sorry, this is probably a bug in Illumina. Error code: IL-K882A");
  }

  return getIronSession<Session>(await cookies(), {
    cookieName: "sid",
    password: process.env.COOKIE_PASSWORD,
  });
};

export default getSession;
