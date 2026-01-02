import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { Toaster } from "@/components/ui/sonner";
import { appName } from "@/config";
import { useUnreadCount } from "@/lib/bluesky/hooks/use-unread-count";
import { ErrorBoundary } from "../components/error-boundary";
import { Navbar } from "../components/navigation/navbar";
import { useSettings } from "../hooks/use-setting";
import "../index.css";
import { useBlueskyStore } from "../lib/bluesky/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { cn } from "../lib/utils";
import i18n from "../i18n";

export const Route = createRootRoute({
  component: Root,
  beforeLoad: async ({ location }) => {
    // Attempt to restore the session
    await useBlueskyStore.getState().restoreSession();

    if (location.pathname.startsWith("/login")) {
      // if already authenticated, redirect to root
      const { isAuthenticated } = useBlueskyStore.getState();
      if (isAuthenticated) {
        throw redirect({ to: "/" });
      }

      // if not authenticated, proceed to login
      return;
    }

    // redirect to profile
    if (location.pathname.startsWith("/@")) {
      throw redirect({
        to: "/profile/$handle",
        params: { handle: location.pathname.slice(2) },
      });
    }
  },
});

function Root() {
  const { experiments, font, language } = useSettings();
  const dir = i18n.dir(language);
  const { data: unreadCount } = useUnreadCount();

  const { updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.info(`Service Worker at: ${ swUrl }`);
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 5_000);
      }
    },
    onNeedRefresh() {
      toast.info("A new version of the app is available.", {
        action: {
          label: "Update",
          onClick() {
            updateServiceWorker(true);
          },
        },
      });
    },
    onRegisterError(error) {
      if (experiments.devMode) {
        toast.info("SW registration error", error);
      }
    },
  });

  return (
    <>
      <Helmet titleTemplate={`${ unreadCount ? `(${ unreadCount })` : "" } %s - ${ appName }`} defaultTitle={appName} />
      <OfflineBanner />
      <main
        dir={dir}
        lang={language}
        className={cn(
          "bg-background text-foreground w-full flex justify-center",
          font.family === "OpenDyslexic" && "font-[OpenDyslexic]",
          font.family === "Atkinson-Hyperlegible" && "font-[Atkinson-Hyperlegible]",
          font.size === "extra-small" && "text-xs",
          font.size === "small" && "text-sm",
          font.size === "medium" && "text-base",
          font.size === "large" && "text-lg",
          font.size === "extra-large" && "text-xl",
        )}
      >
        <ErrorBoundary>
          <div className="flex mx-auto lg:flex-row lg:w-fit lg:gap-2">
            <Navbar />
            <div className="flex justify-center mx-auto">
              <div className="flex flex-col sm:border-x w-screen md:max-w-5xl">
                <ErrorBoundary>
                  <Outlet key="app" />
                </ErrorBoundary>
              </div>
            </div>
          </div>
          {experiments.devMode && (
            <div className="fixed bottom-12 right-2 z-50">
              <ReactQueryDevtools buttonPosition="relative" />
            </div>
          )}

          {experiments.devMode && (
            <TanStackRouterDevtools
              toggleButtonProps={{
                style: {
                  position: "fixed",
                  bottom: "4rem",
                  left: "1em",
                  zIndex: 50,
                },
              }}
            />
          )}
          <Toaster />
        </ErrorBoundary>
      </main>
    </>
  );
}
