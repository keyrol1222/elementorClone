"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  MotionFadeUp,
  staggerContainer,
  staggerItem,
} from "@/components/motion";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32">
      <MotionFadeUp className="mx-auto max-w-3xl text-center">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Visual website builder
        </motion.div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Build stunning websites{" "}
          <span className="text-primary">without code</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          PageCraft is a production-ready visual page builder with drag-and-drop
          editing, responsive controls, and a JSON-driven render engine.
        </p>
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <Button size="lg" asChild>
              <Link href="/login">
                Start building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Explore features</Link>
            </Button>
          </motion.div>
        </motion.div>
      </MotionFadeUp>
    </section>
  );
}
