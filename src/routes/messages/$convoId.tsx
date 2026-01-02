import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useBlueskyStore } from "@/lib/bluesky/store";

export const Route = createFileRoute("/messages/$convoId")({
  beforeLoad: async ({ params }) => {
    const isAuthenticated = useBlueskyStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: `/messages/${ params.convoId }` }});
    }
  },
  validateSearch: z.object({
    embed: z.string().optional(),
  }),
});
