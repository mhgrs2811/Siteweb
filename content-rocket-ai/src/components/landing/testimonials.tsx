"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sophie M.", role: "Créatrice TikTok – 245K abonnés", text: "Content Rocket AI a multiplié mes vues par 3 en 2 semaines. Les hooks générés sont incroyables, mon audience adore.", avatar: "SM" },
  { name: "Lucas R.", role: "YouTubeur Tech – 89K abonnés", text: "Le calendrier éditorial m'a sauvé la vie. Je n'ai plus de panic créatif, j'ai des idées pour 3 mois d'avance.", avatar: "LR" },
  { name: "Agency Digital PRO", role: "Agence – 23 clients gérés", text: "Le plan Agency nous permet de gérer tous nos clients depuis une seule interface. ROI énorme pour notre équipe.", avatar: "AD" },
  { name: "Marie T.", role: "Coach Instagram – 67K abonnés", text: "Les scripts générés sonnent exactement comme moi, mais en mieux. Je publie 2x plus sans travailler plus.", avatar: "MT" },
  { name: "Tom B.", role: "Influenceur Lifestyle – 312K abonnés", text: "J'utilise l'outil chaque matin. En 5 minutes j'ai mon contenu de la journée prêt. Indispensable.", avatar: "TB" },
  { name: "Emma K.", role: "Brand Manager – L'Oréal", text: "Pour nos campagnes social media, Content Rocket AI nous permet de produire du contenu de qualité 5x plus vite.", avatar: "EK" },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Témoignages</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Des créateurs qui cartonnent</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
