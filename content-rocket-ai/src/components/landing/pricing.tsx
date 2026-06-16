"use client";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";

const plans = [
  { key: "FREE", ...PLANS.FREE, cta: "Commencer gratuitement", href: "/sign-up", popular: false },
  { key: "PRO", ...PLANS.PRO, cta: "Démarrer en Pro", href: "/sign-up?plan=pro", popular: true },
  { key: "AGENCY", ...PLANS.AGENCY, cta: "Démarrer en Agency", href: "/sign-up?plan=agency", popular: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Tarifs</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Simple et transparent</h2>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">Commencez gratuitement, upgradez quand vous voulez.</p>
          
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
            <Zap className="h-4 w-4" />
            Offre de lancement : -30% les 3 premiers mois avec le code ROCKET30
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? "border-violet-500 bg-violet-600 text-white shadow-2xl shadow-violet-500/25 scale-105"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-400 text-amber-900 shadow-lg">⭐ Le plus populaire</Badge>
                </div>
              )}

              <div>
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? "text-white" : ""}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : ""}`}>
                    {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-zinc-400"}`}>/mois</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-500"}`} />
                      <span className={plan.popular ? "text-violet-100" : "text-zinc-600 dark:text-zinc-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={plan.href} className="mt-auto">
                <Button
                  className={`w-full ${plan.popular ? "bg-white text-violet-700 hover:bg-violet-50" : ""}`}
                  variant={plan.popular ? "outline" : "default"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-zinc-400">
          Sans engagement · Annulation en 1 clic · Paiement sécurisé Stripe
        </p>
      </div>
    </section>
  );
}
