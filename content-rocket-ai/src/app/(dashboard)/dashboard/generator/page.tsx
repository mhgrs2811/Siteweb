import { GeneratorForm } from "@/components/generator/generator-form";

export const metadata = { title: "Générateur" };

export default function GeneratorPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Générateur de contenu viral</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          GPT-4 génère votre contenu optimisé en quelques secondes.
        </p>
      </div>
      <GeneratorForm />
    </div>
  );
}
