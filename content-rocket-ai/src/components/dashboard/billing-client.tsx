"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { Plan } from "@/types";

interface Props {
  plan: Plan;
  targetPlan?: "PRO" | "AGENCY";
  stripeCustomerId?: string | null;
}

export function BillingClient({ plan, targetPlan, stripeCustomerId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Erreur lors de la redirection vers le paiement");
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (plan !== "FREE" && !targetPlan) {
    return (
      <Button variant="outline" size="sm" onClick={handlePortal} loading={loading}>
        Gérer l&apos;abonnement
      </Button>
    );
  }

  if (targetPlan) {
    return (
      <Button onClick={handleCheckout} loading={loading} className="w-full">
        Passer au {targetPlan === "PRO" ? "Pro" : "Agency"}
      </Button>
    );
  }

  return null;
}
