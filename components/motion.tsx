"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

type MotionFadeProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function MotionFade({
  className,
  delay = 0,
  children,
  ...props
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.exit}
      transition={{ duration: 0.2, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionFadeUp({
  className,
  delay = 0,
  children,
  ...props
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      exit={fadeUp.exit}
      transition={{ duration: 0.28, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn("h-full", className)}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MotionScaleIn({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
