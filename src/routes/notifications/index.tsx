import { createFileRoute, redirect } from "@tanstack/react-router";
import { useBlueskyStore } from "@/lib/bluesky/store";

export const Route = createFileRoute("/notifications/")({
  beforeLoad: async () => {
    const isAuthenticated = useBlueskyStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: "/notifications/" }});
    }
  },
});
