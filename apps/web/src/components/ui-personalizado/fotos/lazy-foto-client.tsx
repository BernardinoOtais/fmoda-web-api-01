"use client";
import { useEffect, useRef, useState } from "react";

import FotoClient from "./foto-client";

export const LazyFotoClient = (
  props: React.ComponentProps<typeof import("./foto-client").default>
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // load only once
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-16 w-16 flex items-center justify-center">
      {isVisible ? (
        <FotoClient {...props} />
      ) : (
        <div className="h-16 w-16 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
};
