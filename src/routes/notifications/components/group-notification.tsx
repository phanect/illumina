import {
  isBSkyFollowNotification,
  isBSkyLikeNotifications,
  isBSkyMentionNotification,
  isBSkyQuoteNotification,
  isBSkyReplyNotification,
  isBSkyRepostNotification,
  isBSkyStarterpackJoinedNotification,
  type BSkyNotification,
} from "@/lib/bluesky/types/bsky-notification";
import { FollowNotification } from "./follow-notification";
import { LikeNotification } from "./like-notification";
import { MentionNotification } from "./mention-notification";
import { QuoteNotification } from "./quote-notification";
import { ReplyNotification } from "./reply-notification";
import { RepostNotification } from "./repost-notification";
import { StarterpackJoinedNotification } from "./starterpack-joined-notification";

export function GroupNotification({ notifications }: { notifications: BSkyNotification[]; }) {
  const notification = notifications[0];
  if (!notification) {
    return null;
  }

  switch (true) {
    case isBSkyFollowNotification(notification):
      return <FollowNotification notification={notification} />;
    case isBSkyLikeNotifications(notifications):
      return <LikeNotification notifications={notifications} />;
    case isBSkyRepostNotification(notification):
      return <RepostNotification notification={notification} />;
    case isBSkyReplyNotification(notification):
      return <ReplyNotification notification={notification} />;
    case isBSkyMentionNotification(notification):
      return <MentionNotification notification={notification} />;
    case isBSkyQuoteNotification(notification):
      return <QuoteNotification notification={notification} />;
    case isBSkyStarterpackJoinedNotification(notification):
      return <StarterpackJoinedNotification notification={notification} />;
  }
}
