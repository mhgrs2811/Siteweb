"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Est-ce que le contenu généré est unique ?", a: "Oui, chaque génération est unique et personnalisée selon votre niche, audience et objectif. L'IA ne génère jamais deux fois le même contenu." },
  { q: "Puis-je utiliser le contenu sur toutes les plateformes ?", a: "Absolument ! Content Rocket AI supporte TikTok, Instagram Reels, YouTube Shorts et Facebook Reels. Chaque génération est optimisée pour la plateforme choisie." },
  { q: "Que se passe-t-il si j'atteins ma limite de générations ?", a: "Sur le plan Gratuit, vous avez 10 générations par mois. Une fois la limite atteinte, vous pouvez passer au plan Pro pour des générations illimitées." },
  { q: "Puis-je annuler mon abonnement ?", a: "Oui, vous pouvez annuler à tout moment depuis votre dashboard. L'annulation prend effet à la fin de la période en cours." },
  { q: "Le contenu généré est-il en français ?", a: "Oui, tout le contenu est généré en français par défaut. Vous pouvez spécifier la langue souhaitée dans vos paramètres." },
  { q: "Comment fonctionne le plan Agency ?", a: "Le plan Agency vous permet de gérer plusieurs clients depuis une seule interface. Chaque client a son propre espace avec son historique de générations." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Questions fréquentes</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
