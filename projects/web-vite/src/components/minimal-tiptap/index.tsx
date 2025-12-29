import "./styles/index.css";

import { EditorContent, type Content, type Editor } from "@tiptap/react";
// import { SectionOne } from './components/section/one';
// import { SectionThree } from './components/section/three';
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/measured-container";
import { SectionFive } from "./components/section/five";
import { SectionFour } from "./components/section/four";
import { SectionTwo } from "./components/section/two";
import { useMinimalTiptapEditor, type UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";

const Toolbar = ({ editor, className }: { editor: Editor; className?: string; }) => (
  <div className={cn("shrink-0 overflow-x-auto border-b border-border p-2", className)}>
    <div className="flex w-max items-center gap-px">
      {/* <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} /> */}

      {/* <Separator orientation="vertical" className="mx-2 h-7" /> */}

      <SectionTwo editor={editor} activeActions={[ "bold", "italic", "underline", "clearFormatting" ]} mainActionCount={4} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      {/* <SectionThree editor={editor} /> */}

      {/* <Separator orientation="vertical" className="mx-2 h-7" /> */}

      <SectionFour editor={editor} activeActions={[ "orderedList", "bulletList" ]} mainActionCount={0} />

      {/* <Separator orientation="vertical" className="mx-2 h-7" /> */}

      <SectionFive editor={editor} activeActions={[]} mainActionCount={0} />
    </div>
  </div>
);

type TiptapMethods = {
  clearContent: () => void;
};

export type MinimalTiptapProps = {
  value?: Content;
  onChange?: (value: Content) => void;
  classNames?: {
    wrapper?: string;
    editor?: string;
    toolbar?: string;
  };
} & Omit<UseMinimalTiptapEditorProps, "onUpdate" | "editorClassName">;

export const MinimalTiptapEditor = forwardRef((
  { value, onChange, classNames, ...props }: MinimalTiptapProps,
  ref: React.ForwardedRef<TiptapMethods>,
) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });
  const editorRef = useRef(editor);
  useImperativeHandle(ref, () => ({
    clearContent: () => {
      editorRef.current?.commands.clearContent();
    },
  }));

  if (!editor) {
    return null;
  }
  editorRef.current = editor;

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn("flex h-auto min-h-72 w-full flex-col rounded-md border border-input", classNames?.wrapper)}
    >
      <EditorContent editor={editor} className={cn("minimal-tiptap-editor flex-1 h-full", classNames?.editor)} />
      <Toolbar editor={editor} className={classNames?.toolbar} />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
});
