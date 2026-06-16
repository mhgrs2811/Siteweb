"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-100 dark:bg-violet-950/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100 dark:bg-indigo-950/20 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-6 gap-1.5">
            <Zap className="h-3 w-3" />
            Propulsé par GPT-4 · Nouveau
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
        >
          Générez du contenu{" "}
          <span className="gradient-text">viral</span>
          <br />
          en 10 secondes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          TikTok, Instagram Reels, YouTube Shorts, Facebook Reels. L&apos;IA génère vos hooks, scripts, hashtags et calendrier éditorial en quelques secondes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 text-base px-8 shadow-xl shadow-violet-500/30">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="gap-2 text-base px-8">
              <Play className="h-4 w-4" />
              Voir la démo
            </Button>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>+2 847 créateurs actifs</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">4.9/5 (324 avis)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>+127% de vues en moyenne</span>
          </div>
        </motion.div>

        {/* Hero preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 p-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center px-3">
                <span className="text-xs text-zinc-400">app.contentrocket.ai/dashboard</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              {[
                { icon: "🎯", label: "Hook viral", value: "\"POV: Tu découvres le secret que...\"" },
                { icon: "📝", label: "Script complet", value: "Hook + Développement + CTA optimisé" },
                { icon: "📅", label: "Calendrier 30J", value: "Plan éditorial personnalisé" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 text-left">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{item.label}</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
