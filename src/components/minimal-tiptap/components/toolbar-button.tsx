import { forwardRef } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";

type ToolbarButtonProps = {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
} & React.ComponentPropsWithoutRef<typeof Toggle>;

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ isActive, children, tooltip, className, tooltipOptions, ...props }, ref) => {
    const toggleButton = (
      <Toggle size="sm" ref={ref} className={cn("size-8 p-0", { "bg-accent": isActive }, className)} {...props}>
        {children}
      </Toggle>
    );

    if (!tooltip) {
      return toggleButton;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
        <TooltipContent {...tooltipOptions}>
          <div className="flex flex-col items-center text-center">{tooltip}</div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
