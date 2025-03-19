import { RefObject, useEffect } from "react";

export const useClickOutside = <T extends HTMLElement>(
  refs:
    | RefObject<T>
    | Array<RefObject<HTMLDivElement | HTMLImageElement | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      const isInside = refArray.some((ref) =>
        ref.current?.contains(event.target as Node),
      );

      if (isInside) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
};
