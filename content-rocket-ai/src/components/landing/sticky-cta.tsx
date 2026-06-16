"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4"
        >
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-900 dark:bg-white border border-zinc-800 dark:border-zinc-200 p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white dark:text-zinc-900">10 générations gratuites</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Sans carte bancaire</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/sign-up">
                <Button size="sm">Essayer</Button>
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="text-zinc-400 hover:text-zinc-300 dark:text-zinc-500 dark:hover:text-zinc-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
