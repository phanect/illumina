import { forwardRef, useImperativeHandle, useRef, type ComponentProps, type ElementType, type ReactNode, type Ref } from "react";
import { useContainerSize } from "../hooks/use-container-size";

type MeasuredContainerProps<T extends ElementType> = {
  as: T;
  name: string;
  children?: ReactNode;
};

export const MeasuredContainer = forwardRef(
  <T extends ElementType>(
    { as: Component, name, children, style = {}, ...props }: MeasuredContainerProps<T> & ComponentProps<T>,
    ref: Ref<HTMLElement>,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const rect = useContainerSize(innerRef.current);

    useImperativeHandle(ref, () => innerRef.current!);

    const customStyle = {
      [`--${ name }-width`]: `${ rect.width }px`,
      [`--${ name }-height`]: `${ rect.height }px`,
    };

    return (
      <Component {...props} ref={innerRef} style={{ ...customStyle, ...style }}>
        {children}
      </Component>
    );
  },
);

MeasuredContainer.displayName = "MeasuredContainer";
