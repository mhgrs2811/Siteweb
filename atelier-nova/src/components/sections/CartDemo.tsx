"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Démonstration interactive du parcours d’achat du concept Orbe Café.
 * Entièrement locale : aucun paiement, aucune donnée envoyée.
 */
type Product = { id: string; name: string; origin: string; notes: string; price: number; color: string };

const products: Product[] = [
  { id: "aube", name: "Aube", origin: "Éthiopie, Guji", notes: "Jasmin, pêche blanche, bergamote", price: 16.5, color: "#E2B13C" },
  { id: "braise", name: "Braise", origin: "Colombie, Huila", notes: "Cacao, caramel, orange sanguine", price: 14.9, color: "#D2452B" },
  { id: "nuit", name: "Nuit", origin: "Brésil, Mogiana", notes: "Noisette, chocolat noir, mélasse", price: 13.5, color: "#2A1A14" },
];
const grinds = ["Grains", "Espresso", "Filtre", "Piston"];
const FREE_SHIPPING = 35;

const eur = (n: number) => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(n);

export function CartDemo() {
  const [selected, setSelected] = useState(products[1]);
  const [grind, setGrind] = useState(grinds[1]);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ key: string; p: Product; grind: string; qty: number }[]>([]);
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const total = cart.reduce((s, l) => s + l.p.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const remaining = Math.max(0, FREE_SHIPPING - total);

  const add = () => {
    const key = `${selected.id}-${grind}`;
    setCart((c) => {
      const found = c.find((l) => l.key === key);
      if (found) return c.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...c, { key, p: selected, grind, qty }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    setOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[color-mix(in_srgb,#2A1A14_15%,transparent)] bg-[#F3EDE2] text-[#2A1A14]">
      <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,#2A1A14_12%,transparent)] px-5 py-4 md:px-8">
        <p className="text-lg font-semibold tracking-tight">orbe.</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-[#2A1A14]/20 px-4"
          aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
        >
          <ShoppingBag size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="tabular-nums">{count}</span>
        </button>
      </div>

      <div className="grid gap-8 p-5 md:grid-cols-2 md:gap-12 md:p-10">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[8px] transition-colors duration-700" style={{ backgroundColor: selected.color }}>
          {/* Boîte de café stylisée en CSS */}
          <div
            key={selected.id}
            className="cart-tin relative flex h-[62%] w-[42%] flex-col items-center justify-between rounded-[10px] bg-[#F3EDE2] py-[8%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]"
          >
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">orbe</span>
            <span className="text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-none tracking-tight" style={{ color: selected.color === "#2A1A14" ? "#2A1A14" : selected.color }}>
              {selected.name}
            </span>
            <span className="px-2 text-center text-[0.65rem] uppercase tracking-[0.15em] opacity-70">{selected.origin}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Café de spécialité · 250 g</p>
          <fieldset className="mt-4">
            <legend className="sr-only">Choisir un café</legend>
            <div className="flex flex-wrap gap-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={selected.id === p.id}
                  onClick={() => setSelected(p)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors",
                    selected.id === p.id ? "border-[#2A1A14] bg-[#2A1A14] text-[#F3EDE2]" : "border-[#2A1A14]/25 hover:border-[#2A1A14]",
                  )}
                >
                  <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color, boxShadow: "0 0 0 1px rgb(243 237 226 / .6)" }} />
                  {p.name}
                </button>
              ))}
            </div>
          </fieldset>
          <h3 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">{selected.name}</h3>
          <p className="mt-2 text-lg">{selected.notes}</p>
          <p className="mt-1 text-sm opacity-70">{selected.origin}</p>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Mouture</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {grinds.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={grind === g}
                  onClick={() => setGrind(g)}
                  className={cn(
                    "min-h-11 rounded-[6px] border px-4 text-sm transition-colors",
                    grind === g ? "border-[#2A1A14] bg-[#2A1A14] text-[#F3EDE2]" : "border-[#2A1A14]/25 hover:border-[#2A1A14]",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-[#2A1A14]/25">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center" aria-label="Diminuer la quantité">
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid h-11 w-11 place-items-center" aria-label="Augmenter la quantité">
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              className="relative inline-flex min-h-12 flex-1 items-center justify-center overflow-hidden rounded-full bg-[#D2452B] px-6 font-semibold text-[#F3EDE2] transition-transform active:scale-[0.98]"
            >
              <span className={cn("transition-transform duration-500", added && "-translate-y-[150%]")}>Ajouter · {eur(selected.price * qty)}</span>
              <span className={cn("absolute transition-transform duration-500", added ? "translate-y-0" : "translate-y-[150%]")}>Ajouté au panier</span>
            </button>
          </div>
          <p className="mt-4 text-sm opacity-70">Livraison offerte dès {eur(FREE_SHIPPING)} en Belgique.</p>
        </div>
      </div>

      {/* Tiroir panier */}
      <div className={cn("absolute inset-0 z-10 transition-colors duration-500", open ? "bg-[#2A1A14]/40" : "pointer-events-none bg-transparent")} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        aria-label="Panier de démonstration"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "absolute inset-y-0 right-0 z-20 flex w-full max-w-[400px] flex-col bg-[#F3EDE2] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[#2A1A14]/10 px-6 py-4">
          <p className="text-lg font-semibold">Panier ({count})</p>
          <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full" aria-label="Fermer le panier">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm">{remaining > 0 ? <>Plus que <strong>{eur(remaining)}</strong> pour la livraison offerte</> : <strong>Livraison offerte</strong>}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2A1A14]/10">
            <div className="h-full rounded-full bg-[#D2452B] transition-[width] duration-700" style={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }} />
          </div>
        </div>
        <ul className="flex-1 space-y-3 overflow-y-auto px-6">
          {cart.length === 0 ? <li className="py-10 text-center opacity-60">Votre panier est vide.</li> : null}
          {cart.map((l) => (
            <li key={l.key} className="flex items-center gap-4 border-b border-[#2A1A14]/10 py-3">
              <span aria-hidden="true" className="h-14 w-11 rounded-[4px]" style={{ backgroundColor: l.p.color }} />
              <span className="flex-1">
                <span className="block font-semibold">{l.p.name}</span>
                <span className="block text-sm opacity-70">
                  {l.grind} · {l.qty} × {eur(l.p.price)}
                </span>
              </span>
              <button type="button" onClick={() => setCart((c) => c.filter((x) => x.key !== l.key))} className="min-h-11 px-2 text-sm underline">
                Retirer
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-[#2A1A14]/10 p-6">
          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{eur(total)}</span>
          </p>
          <button type="button" disabled={!cart.length} className="mt-4 min-h-12 w-full rounded-full bg-[#2A1A14] font-semibold text-[#F3EDE2] disabled:opacity-40">
            Paiement (désactivé dans la démo)
          </button>
          <p className="mt-3 text-center text-xs opacity-60">Démonstration : aucune commande n’est passée.</p>
        </div>
      </aside>
    </div>
  );
}
