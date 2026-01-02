import { VisuallyHidden } from "@ariakit/react";
import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { forwardRef, useEffect, useState, type HtmlHTMLAttributes, type Ref } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import { convertJSONToPost } from "@/components/convert";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { PostCard } from "@/components/post-card";
import { StickyHeader } from "@/components/sticky-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loading } from "@/components/ui/loading";
import { useCreatePost } from "@/lib/bluesky/hooks/use-create-post";
import { usePostThread } from "@/lib/bluesky/hooks/use-post-thread";
import { useProfile } from "@/lib/bluesky/hooks/use-profile";
import { useBlueskyStore } from "@/lib/bluesky/store";
import type { Facet } from "@atproto/api";
import type { JSONContent } from "@tiptap/react";
import type { BSkyPost } from "@/lib/bluesky/types/bsky-post";

export const Route = createLazyFileRoute("/profile/$handle/post/$postId")({
  component: Post,
});

const List = forwardRef((props: HtmlHTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
  return <div ref={ref} {...props} className="flex flex-col divide-y" />;
});

function Post() {
  const { handle } = Route.useParams();
  const { data: profile, isLoading: isLoadingProfile } = useProfile({ handle });
  const params = Route.useParams();
  const { data: postThread, isLoading: isLoadingPost } = usePostThread({
    uri: `at://${ params.handle }/app.bsky.feed.post/${ params.postId }`,
  });
  const { t } = useTranslation([ "app", "profile" ]);
  const isLoading = isLoadingProfile || isLoadingPost;
  const replies = (postThread?.replies as { post: BSkyPost; }[]) ?? [];

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <div className="w-137.5 h-screen overflow-y-scroll">{t("profile:notFound")}</div>;
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://bsky.app/profile/${ handle }/post/${ params.postId }`} />
        <title>
          {profile.displayName ?? profile.handle}
          : "
          {(postThread?.post as BSkyPost).record.text}
          "
        </title>
      </Helmet>
      <StickyHeader>
        <h1 className="text-xl font-bold">{t("post")}</h1>
      </StickyHeader>
      <div className="h-full">
        <Virtuoso
          useWindowScroll
          // we need the [&>*]: since we're targeting the window scroll div
          // and the div is inside of the Virtuoso component
          className="[&>*]:flex [&>*]:flex-col"
          totalCount={replies.length}
          itemContent={(index) => {
            const reply = replies?.[index];
            if (!reply) {
              return null;
            }
            return reply.post && <PostCard post={reply.post} key={reply.post.uri} />;
          }}
          components={{
            Header: () => (
              <>
                {!!postThread?.parent && <PostCard post={(postThread?.parent as { post: BSkyPost; }).post} parent={true} />}
                <PostCard post={postThread?.post as BSkyPost} className="border-b" />
                <ReplyBox />
              </>
            ),
            List,
            Footer: () => <div className="h-96" />,
          }}
        />
      </div>
    </>
  );
}

function ReplyBox() {
  const queryClient = useQueryClient();
  const { t } = useTranslation([ "app", "profile" ]);
  const params = Route.useParams();
  const { data: postThread } = usePostThread({
    uri: `at://${ params.handle }/app.bsky.feed.post/${ params.postId }`,
  });
  const session = useBlueskyStore((state) => state.session);
  const { mutate, isPending } = useCreatePost();
  const [ value, setValue ] = useState<JSONContent | null>(null);
  const [ isOpen, setIsOpen ] = useState(false);
  const { data: ownProfile } = useProfile({ handle: session?.did });
  const [ converted, setConverted ] = useState<{
    text: string;
    facets: Facet[];
    position: number;
  } | null>(null);

  useEffect(() => {
    if (!value) {
      return;
    }
    setConverted(convertJSONToPost(value));
  }, [ value ]);

  const onClickPost = () => {
    if (!converted) {
      return;
    }

    const parent = postThread?.parent as
      | {
        post: BSkyPost;
      }
      | undefined;
    const root = postThread?.post as BSkyPost;

    mutate(
      {
        text: converted.text,
        facets: converted.facets ?? [],
        reply: {
          parent: {
            uri: parent?.post.uri ?? root.uri,
            cid: parent?.post.cid ?? root.cid,
          },
          root: {
            uri: root.uri,
            cid: root.cid,
          },
        },
      },
      {
        onSuccess() {
          setValue(null);
          setConverted(null);
          setIsOpen(false);
          queryClient.invalidateQueries({
            queryKey: [ "post" ],
          });
        },
      },
    );
  };

  const onClickCancel = () => {
    setIsOpen(false);
  };

  if (!ownProfile?.handle) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="border-b p-1">
          <div className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer w-full flex flex-row items-center gap-2 p-1">
            <Avatar handle={ownProfile?.handle} avatar={ownProfile?.avatar} className="size-8" hover={false} />
            <div className="p-2 ">write your reply</div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden p-0 border">
        <VisuallyHidden>
          <DialogTitle>{t("reply")}</DialogTitle>
          <DialogDescription>{t("replyToPost")}</DialogDescription>
        </VisuallyHidden>
        <DialogHeader className="justify-between w-full p-2">
          <Button type="button" variant="ghost" onClick={onClickCancel} disabled={isPending} className="text-gray-500">
            {t("cancel")}
          </Button>
          <Button type="button" variant="outline" onClick={onClickPost} disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </Button>
        </DialogHeader>
        <MinimalTiptapEditor
          value={value}
          onChange={(value) => setValue(value as JSONContent)}
          classNames={{
            wrapper: "w-full border-none",
            editor: "border-none pt-0",
          }}
          output="json"
          placeholder="Type something..."
          autofocus={true}
          editable={!isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
