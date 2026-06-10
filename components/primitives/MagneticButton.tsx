"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

/**
 * Magnetic pull toward the pointer. Rect is cached on enter (never read
 * per-move), offsets are motion values (no React re-renders per move).
 * Degrades to a plain element on touch / reduced motion.
 */
export default function MagneticButton({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const { canEnhance } = useMediaPreferences();
  const rect = useRef<DOMRect | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    rect.current = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = rect.current;
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    rect.current = null;
    mx.set(0);
    my.set(0);
  };

  if (!canEnhance) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
