import { useState, useEffect, useRef } from "react";

export const useDebouncedAnimation = (value: string, delay: number = 1000) => {
  const [animationKey, setAnimationKey] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return animationKey;
};
