import { useState, useEffect, useRef, type RefObject } from "react";

interface IntersectionResult {
  ref: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export function useIntersectionEntrance(threshold: number = 0.1): IntersectionResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
