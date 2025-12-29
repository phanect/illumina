import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/avatar";
import type { BSkyStarterpackJoinedNotification } from "@/lib/bluesky/types/bsky-notification";

export function StarterpackJoinedNotification({ notification }: { notification: BSkyStarterpackJoinedNotification; }) {
  const { t } = useTranslation("notifications");
  return (
    <div>
      <div className="flex flex-row gap-1 overflow-hidden max-h-16">
        <Avatar handle={notification.author.handle} avatar={notification.author.avatar} classNames={{ wrapper: "size-8" }} />
      </div>
      <div>
        {notification.author.displayName} {t("joinedYourStarterpack")}
      </div>
    </div>
  );
}
