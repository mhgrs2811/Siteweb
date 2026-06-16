"use client";
import { motion } from "framer-motion";
import { Lightbulb, Zap, FileText, Hash, Calendar, Video, Globe, TrendingUp } from "lucide-react";

const features = [
  { icon: Lightbulb, title: "Idées de vidéos", desc: "10 idées virales générées par l'IA selon votre niche et audience.", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
  { icon: Zap, title: "Hooks viraux", desc: "15 accroches irrésistibles qui arrêtent le scroll en 2 secondes.", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20" },
  { icon: FileText, title: "Scripts complets", desc: "Script structuré : hook, développement, CTA — prêt à tourner.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
  { icon: Hash, title: "Hashtags stratégiques", desc: "Stratégie hashtags sur mesure pour maximiser votre portée.", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20" },
  { icon: Calendar, title: "Calendrier éditorial", desc: "30 jours de contenu planifié avec les meilleurs horaires.", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/20" },
  { icon: Video, title: "Titres YouTube SEO", desc: "Titres optimisés pour le référencement et le taux de clic.", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
  { icon: Globe, title: "Descriptions optimisées", desc: "Descriptions SEO avec mots-clés intégrés naturellement.", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
  { icon: TrendingUp, title: "CTA puissants", desc: "Appels à l'action qui convertissent vos vues en abonnés.", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Tout ce qu&apos;il vous faut pour dominer vos réseaux</h2>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            8 types de contenu générés par GPT-4, optimisés pour chaque plateforme.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} mb-4`}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
