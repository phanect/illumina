import { ImageIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToolbarButton } from "../toolbar-button";
import { ImageEditBlock } from "./image-edit-block";
import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import type { toggleVariants } from "@/components/ui/toggle";

type ImageEditDialogProps = {
  editor: Editor;
} & VariantProps<typeof toggleVariants>;

export const ImageEditDialog = ({ editor, size, variant }: ImageEditDialogProps) => {
  const [ open, setOpen ] = useState(false);
  const { t } = useTranslation("editor");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ToolbarButton isActive={editor.isActive("image")} tooltip="Image" aria-label="Image" size={size} variant={variant}>
          <ImageIcon className="size-5" />
        </ToolbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("toolbar.selectImage.title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("toolbar.selectImage.description")}</DialogDescription>
        </DialogHeader>
        <ImageEditBlock editor={editor} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
