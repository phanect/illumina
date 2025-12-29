import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangleIcon } from "lucide-react";
import { memo, type ReactElement } from "react";
import ReactPlayer from "react-player";
import { usePostLabels } from "@/lib/bluesky/hooks/use-post-labels";
import { useBlueskyStore } from "@/lib/bluesky/store";
import { ErrorBoundary } from "./error-boundary";
import { cn } from "../lib/utils";
import { Image } from "./ui/image.tsx";
import type { BSkyPost } from "../lib/bluesky/types/bsky-post";

type ThumbnailImageProps = {
  post: BSkyPost;
};

const ThumbnailImage = ({ post }: ThumbnailImageProps): ReactElement | null => {
  const navigate = useNavigate();

  const shortenTitle = (text: string) => text
    .split(" ")
    .filter((textFragment) => !textFragment.trim().startsWith("#"))
    .join(" ")
    .substring(0, 48);

  const onClick = () => {
    const cellText = document.getSelection();
    if (cellText?.type === "Range") {
      return;
    }

    navigate({
      to: "/profile/$handle/post/$postId",
      params: { handle: post.author.handle, postId: post.uri.split("/").pop()! },
    });
  };

  return (
    <div className="w-48 cursor-pointer" onClick={onClick}>
      {(post.embed?.$type === "app.bsky.embed.images#view" && post.embed.images[0]) ? (
        <Image
          key={post.embed.images[0].thumb}
          src={post.embed.images[0].thumb}
          height={48}
          width={48}
          alt={post.embed.images[0].alt}
          classNames={{
            image: cn("w-full h-48 aspect-square", "rounded-lg object-cover"),
          }}
        />
      ) : post.embed?.$type === "app.bsky.embed.video#view" ? (
        <div className={cn("mb-3 w-full aspect-square")}>
          <ReactPlayer
            url={post.embed.playlist}
            controls={true}
            width="100%"
            height="100%"
            muted={true}
            light={post.embed.thumbnail}
            config={{
              file: {
                attributes: {
                  preload: "none",
                },
              },
            }}
          />
        </div>
      ) : null}

      <p className="text-gray-800 dark:text-gray-200 w-full mt-2 pl-1 pr-1 text-center overflow-ellipsis overflow-hidden whitespace-nowrap">
        { shortenTitle(post.record.text) }
      </p>
    </div>
  );
};

type ThumbnailInnerProps = {
  post: BSkyPost;
};

function ThumbnailInner({ post }: ThumbnailInnerProps) {
  const agent = useBlueskyStore((state) => state.agent);
  const { moderation } = usePostLabels({ agent, post });

  // Hide post if it's filtered
  if (moderation?.ui("contentList").filter) {
    return null;
  }
  const contentMedia = moderation?.ui("contentMedia");
  const moderationMediaLabel = contentMedia?.blurs[0]?.type === "label" ? contentMedia.blurs[0]?.labelDef.locales[0] : null;
  const moderationFilter = moderation?.ui("contentMedia").filter;

  return (
    <ErrorBoundary>
      {moderationFilter ? null : moderationMediaLabel ? (
        <Accordion type="single" collapsible onClick={(event) => event.stopPropagation()}>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full group">
              <div className="flex items-center space-x-2 rounded-sm hover:bg-neutral-500 hover:bg-opacity-10 gap-1 border justify-between p-2">
                <div className="flex items-center gap-1">
                  <AlertTriangleIcon size={20} />
                  {moderationMediaLabel?.name}
                </div>
                <div className="group-data-[state=open]:hidden">show</div>
                <div className="hidden group-data-[state=open]:flex">hide</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <ThumbnailImage post={post} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <ThumbnailImage post={post} />
      )}
    </ErrorBoundary>
  );
}

type ThumbnailProps = {
  post: BSkyPost | null | undefined;
  context?: string;
  className?: string;
  parent?: boolean;
};

export const Thumbnail = memo(({ post, ...props }: ThumbnailProps) => {
  if (!post) {
    return null;
  }

  return <ThumbnailInner {...props} post={post} />;
});
