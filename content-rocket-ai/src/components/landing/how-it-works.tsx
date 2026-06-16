"use client";
import { motion } from "framer-motion";
import { ClipboardList, Cpu, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Décrivez votre contexte",
    desc: "Répondez à 4 questions simples : votre niche, votre audience cible, votre objectif et la plateforme choisie.",
    color: "from-violet-500 to-purple-600",
  },
  {
    step: "02",
    icon: Cpu,
    title: "L'IA génère votre contenu",
    desc: "GPT-4 analyse votre contexte et génère du contenu ultra-optimisé pour la viralité en moins de 10 secondes.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: "03",
    icon: Download,
    title: "Exportez & publiez",
    desc: "Copiez en un clic, exportez en PDF ou CSV, sauvegardez dans vos projets et publiez directement.",
    color: "from-green-500 to-teal-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Comment ça marche</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">De l&apos;idée à la publication en 3 étapes</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-violet-200 to-indigo-200 dark:from-violet-900 dark:to-indigo-900" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-6`}>
                <s.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-xs font-bold text-zinc-400 dark:text-zinc-600 mb-2">{s.step}</div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
