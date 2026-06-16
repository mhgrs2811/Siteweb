"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Rocket, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#how-it-works", label: "Comment ça marche" },
    { href: "#pricing", label: "Tarifs" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span>Content Rocket <span className="gradient-text">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Essai gratuit</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 py-4 space-y-3"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-zinc-600 dark:text-zinc-400 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/sign-in"><Button variant="outline" className="w-full">Connexion</Button></Link>
              <Link href="/sign-up"><Button className="w-full">Essai gratuit</Button></Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
