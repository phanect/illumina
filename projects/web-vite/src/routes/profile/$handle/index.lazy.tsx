import { TabPanel, TabProvider } from "@ariakit/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { forwardRef, useState, type HtmlHTMLAttributes, type Ref } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import { ErrorBoundary } from "@/components/error-boundary";
import { PostCard } from "@/components/post-card";
import { Thumbnail } from "@/components/thumbnail.tsx";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { FollowButton } from "@/components/ui/follow-button";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { FormattedText } from "@/components/ui/formatted-text";
import { Handle } from "@/components/ui/handle";
import { Loading } from "@/components/ui/loading";
import { NotFound } from "@/components/ui/not-found";
import { Tab } from "@/components/ui/tab";
import { TabList } from "@/components/ui/tab-list";
import { useSettings } from "@/hooks/use-setting";
import { useAuthorFeed } from "@/lib/bluesky/hooks/use-author-feed";
import { useProfile } from "@/lib/bluesky/hooks/use-profile";
import { useBlueskyStore } from "@/lib/bluesky/store";
import { cn } from "@/lib/utils";
import type { BSkyPost } from "@/lib/bluesky/types/bsky-post";

export const Route = createLazyFileRoute("/profile/$handle/")({
  component: Profile,
});

const PostList = forwardRef((props: HtmlHTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
  return <div ref={ref} {...props} className="flex flex-col divide-y" />;
});

function Posts() {
  const { handle } = Route.useParams();
  const { data, isLoading, fetchNextPage } = useAuthorFeed({ handle });
  const feed = data?.pages.flatMap((page) => page.feed);

  if (isLoading) {
    return <Loading />;
  }
  if (!feed) {
    return null;
  }

  const filteredPosts = feed
    // Filter out replies
    ?.filter(({ post }) => !(post.record as BSkyPost["record"]).reply)
    // Filter out reposts of other users
    ?.filter(({ post }) => post.author.handle === handle);

  return (
    <Virtuoso
      useWindowScroll
      totalCount={filteredPosts.length}
      endReached={() => fetchNextPage()}
      components={{
        List: PostList,
      }}
      itemContent={(index: number) => (
        <ErrorBoundary>
          <PostCard key={filteredPosts[index]?.post.uri} post={filteredPosts[index]?.post as BSkyPost} />
        </ErrorBoundary>
      )}
    />
  );
}

const ThumbnailList = forwardRef((props: HtmlHTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      {...props}
      style={{ padding: "2em" }} // using `style` to overwrite paddings from `props`
      className="flex flex-wrap justify-start gap-6"
    />
  );
});

function Media() {
  const { handle } = Route.useParams();
  const { data, isLoading, fetchNextPage } = useAuthorFeed({ handle });
  const feed = data?.pages.flatMap((page) => page.feed);

  if (isLoading) {
    return <Loading />;
  }
  if (!feed) {
    return null;
  }

  // Filter to only media
  const filteredPosts = feed?.filter(({ post, reason }) =>
    // TODO: fix this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (post.record as any).embed?.$type === "app.bsky.embed.images"
    && reason?.$type !== "app.bsky.feed.defs#reasonRepost"
  );

  return (
    <VirtuosoGrid
      useWindowScroll
      totalCount={filteredPosts.length}
      endReached={() => fetchNextPage()}
      components={{
        List: ThumbnailList,
      }}
      itemContent={(index: number) => (
        <Thumbnail key={filteredPosts[index]?.post.uri} post={filteredPosts[index]?.post as BSkyPost} />
      )}
    />
  );
}

function Profile() {
  const { handle } = Route.useParams();
  const { data: profile, isLoading } = useProfile({ handle });
  const { experiments } = useSettings();
  const { session } = useBlueskyStore();
  const { t } = useTranslation([ "app", "profile" ]);
  const [ selectedTab, setSelectedTab ] = useState<string | null>("media");
  const blocked = profile?.viewer?.blockingByList;

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://bsky.app/profile/${ handle }`} />
        <title>
          {profile.displayName ?? profile.handle} (@{handle})
        </title>
      </Helmet>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <Banner banner={profile?.banner} classNames={{ image: cn(blocked && "blur-xl") }} />
          <div className="px-4 -mt-12">
            <Avatar
              avatar={profile?.avatar}
              handle={profile.handle}
              classNames={{ wrapper: "size-24 border-2", image: blocked && "blur" }}
              hover={false}
            />
            <div>
              <div className="flex gap-2">
                <h2 className="text-xl font-bold">{profile?.displayName || profile.handle}</h2>
                <Badge title={profile.viewer?.following && profile.viewer?.followedBy ? "You both follow each other" : ""}>
                  {profile.viewer?.following && profile.viewer?.followedBy && "Mutuals"}
                </Badge>
                {handle !== session?.handle && !blocked && (
                  <FollowButton handle={handle} following={!!profile.viewer?.following} />
                )}
              </div>
              <Handle handle={profile.handle} />
              {!experiments.zenMode && !blocked && (
                <div className="flex gap-2">
                  <FormattedNumber value={profile?.followersCount} unit={t("followers")} />
                  <FormattedNumber value={profile?.followsCount} unit={t("following")} />
                  <FormattedNumber value={profile?.postsCount} unit={t("posts")} />
                </div>
              )}
              {!blocked && <FormattedText text={profile?.description ?? ""} linkify key="profile-description" />}

              {blocked && (
                <div className="p-2 border mt-2">
                  <span>{t("profile:blockedBy", { name: blocked.name })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {!blocked && (
          <TabProvider
            defaultSelectedId={selectedTab}
            setSelectedId={(selectedId) => {
              if (!selectedId) {
                return;
              }
              setSelectedTab(selectedId);
            }}
          >
            <TabList label="Profile tabs">
              {[
                { name: t("profile:tabs.media"), id: "media" },
                { name: t("profile:tabs.posts"), id: "posts" },
              ].map(({ name, id }) => (
                <Tab name={name} id={id} selectedTab={selectedTab} key={id} />
              ))}
            </TabList>
            <TabPanel tabId="media">
              <Media />
            </TabPanel>
            <TabPanel tabId="posts">
              <Posts />
            </TabPanel>
          </TabProvider>
        )}
      </div>
    </>
  );
}
