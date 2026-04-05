"use client";

import { useEffect, useRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale" | "stagger";
  delay?: number;
};

const variantClass: Record<string, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
  stagger: "stagger",
};

export default function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`${variantClass[variant]} ${className}`}>
      {children}
    </div>
  );
}
