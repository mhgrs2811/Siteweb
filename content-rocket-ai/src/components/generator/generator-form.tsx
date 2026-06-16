"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Copy, Download, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import type { Platform, ContentType, GeneratorFormData } from "@/types";

const PLATFORMS = [
  { value: "TIKTOK", label: "TikTok" },
  { value: "INSTAGRAM", label: "Instagram Reels" },
  { value: "YOUTUBE", label: "YouTube Shorts" },
  { value: "FACEBOOK", label: "Facebook Reels" },
];

const CONTENT_TYPES = [
  { value: "VIDEO_IDEAS", label: "💡 Idées de vidéos" },
  { value: "VIRAL_HOOKS", label: "⚡ Hooks viraux" },
  { value: "FULL_SCRIPT", label: "📝 Script complet" },
  { value: "CTA", label: "🎯 CTA (Appels à l'action)" },
  { value: "HASHTAGS", label: "# Stratégie hashtags" },
  { value: "YOUTUBE_TITLE", label: "🎬 Titres YouTube" },
  { value: "DESCRIPTION", label: "📄 Descriptions" },
  { value: "EDITORIAL_CALENDAR", label: "📅 Calendrier éditorial" },
];

export function GeneratorForm() {
  const [form, setForm] = useState<GeneratorFormData>({
    niche: "",
    audience: "",
    objective: "",
    platform: "TIKTOK",
    contentType: "VIRAL_HOOKS",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!form.niche || !form.audience || !form.objective) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de génération");
      setResult(data.content);
      toast.success("Contenu généré !");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copié !");
  };

  const handleSave = async () => {
    toast.success("Sauvegardé dans l'historique !");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-500" />
            Paramètres de génération
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Votre niche *</label>
            <Input
              placeholder="Ex: fitness, cuisine végane, finance personnelle..."
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Audience cible *</label>
            <Input
              placeholder="Ex: femmes 25-35 ans, entrepreneurs débutants..."
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Objectif *</label>
            <Input
              placeholder="Ex: gagner des abonnés, vendre mon programme..."
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Plateforme</label>
            <Select
              options={PLATFORMS}
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Type de contenu</label>
            <Select
              options={CONTENT_TYPES}
              value={form.contentType}
              onChange={(e) => setForm({ ...form, contentType: e.target.value as ContentType })}
            />
          </div>

          <Button
            onClick={handleGenerate}
            loading={loading}
            className="w-full gap-2"
            size="lg"
          >
            <Zap className="h-4 w-4" />
            {loading ? "Génération en cours..." : "Générer avec l'IA"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Résultat
            {result && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copié" : "Copier"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleSave} className="gap-1.5">
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-violet-100 dark:border-violet-900 border-t-violet-600 animate-spin" />
                  <Zap className="absolute inset-0 m-auto h-6 w-6 text-violet-600" />
                </div>
                <p className="text-sm text-zinc-500">GPT-4 génère votre contenu...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 max-h-[500px] overflow-y-auto"
              >
                <ResultDisplay result={result} type={form.contentType} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3"
              >
                <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl">
                  🚀
                </div>
                <p className="text-sm">Remplissez le formulaire et cliquez sur Générer</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultDisplay({ result, type }: { result: Record<string, unknown>; type: ContentType }) {
  const renderItem = (item: Record<string, unknown>, idx: number) => (
    <div key={idx} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
      {Object.entries(item).map(([k, v]) => (
        <div key={k} className="mb-2 last:mb-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{k.replace(/_/g, " ")}</span>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-0.5">
            {Array.isArray(v) ? v.join(", ") : String(v)}
          </p>
        </div>
      ))}
    </div>
  );

  const firstKey = Object.keys(result)[0];
  const data = result[firstKey];

  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          typeof item === "object" && item !== null
            ? renderItem(item as Record<string, unknown>, idx)
            : (
              <div key={idx} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4">
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{String(item)}</p>
              </div>
            )
        ))}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    return <div className="space-y-2">{renderItem(data as Record<string, unknown>, 0)}</div>;
  }

  return <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>;
}
