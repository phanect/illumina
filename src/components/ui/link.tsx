import { createLink, type LinkComponent } from "@tanstack/react-router";
import { forwardRef, type HtmlHTMLAttributes, type Ref } from "react";
import { cn } from "../../lib/utils";

const BasicLinkComponent = forwardRef((
  props: HtmlHTMLAttributes<HTMLAnchorElement>,
  ref: Ref<HTMLAnchorElement>,
) => {
  return <a ref={ref} {...props} className={cn("hover:underline", props.className)} />;
});

const CreatedLinkComponent = createLink(BasicLinkComponent);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Link: LinkComponent<typeof BasicLinkComponent> = (props: any) => {
  return <CreatedLinkComponent to={props.href} {...props} />;
};
