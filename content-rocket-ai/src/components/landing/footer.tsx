import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span>Content Rocket AI</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Générez du contenu viral avec l&apos;IA.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Produit</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100">Tarifs</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">CGU</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="mailto:hello@contentrocket.ai" className="hover:text-zinc-900 dark:hover:text-zinc-100">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© 2024 Content Rocket AI. Tous droits réservés.</p>
          <p>Fait avec ❤️ et l&apos;IA</p>
        </div>
      </div>
    </footer>
  );
}
