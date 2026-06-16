"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTAFinal() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 text-center text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <Rocket className="h-12 w-12 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold mb-4">Prêt à décoller ?</h2>
            <p className="text-xl text-violet-200 mb-8 max-w-xl mx-auto">
              Rejoignez 2 847 créateurs qui génèrent du contenu viral chaque jour. 10 générations gratuites, sans carte bancaire.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 gap-2 text-base px-8 shadow-xl">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-violet-300">Aucune carte bancaire requise · Configuration en 2 minutes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
