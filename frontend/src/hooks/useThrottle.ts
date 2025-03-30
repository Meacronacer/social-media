import { useCallback, useRef } from "react";

export const useThrottle = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const lastCall = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        fn(...args);
      }
    },
    [fn, delay],
  );
};
