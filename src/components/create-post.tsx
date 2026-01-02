import { type JSONContent } from "@tiptap/react";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBlueskyStore } from "@/lib/bluesky/store";
import { cn } from "@/lib/utils";
import { convertJSONToPost } from "./convert";
import { MinimalTiptapEditor } from "./minimal-tiptap";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { useCreatePost } from "../lib/bluesky/hooks/use-create-post";
import type { Facet } from "@atproto/api";

export function CreatePost({ className }: { className?: string; }) {
  const { t } = useTranslation([ "app", "post" ]);
  const { mutate, isPending } = useCreatePost();
  const [ value, setValue ] = useState<JSONContent | null>(null);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ converted, setConverted ] = useState<{
    text: string;
    facets: Facet[];
    position: number;
  } | null>(null);
  const { isAuthenticated } = useBlueskyStore();

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

    mutate(
      {
        text: converted.text,
        facets: converted.facets ?? [],
      },
      {
        onSuccess() {
          setValue(null);
          setConverted(null);
          setIsOpen(false);
        },
      },
    );
  };

  const onClickCancel = () => {
    setValue(null);
    setConverted(null);
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            // mobile
            "fixed bottom-16 right-2 rounded-full aspect-square size-16",
            // tablet
            "md:bottom-2",
            // desktop
            "xl:static xl:aspect-auto xl:size-auto",
            className,
          )}
        >
          <span className="hidden xl:block">{t("post:createPost")}</span>
          <PencilIcon className="block xl:hidden size-10" />
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden p-0 border">
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
