"use client";
import { useEffect, useRef, useState } from "react";

import FotoClient from "./foto-client";

import { cn } from "@/lib/utils";

export const LazyFotoClient = (
  props: React.ComponentProps<typeof import("./foto-client").default>
) => {
  console.log("A tais foto : ", props.src);
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
  const { cssImage } = props;
  return (
    <div ref={ref} className={cn("flex items-center justify-center", cssImage)}>
      {isVisible ? (
        <FotoClient {...props} />
      ) : (
        <div className={cn("bg-gray-200 animate-pulse rounded", cssImage)} />
      )}
    </div>
  );
};
