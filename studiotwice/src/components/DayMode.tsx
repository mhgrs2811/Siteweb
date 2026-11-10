"use client";

import { useEffect } from "react";

/** Force les couleurs de jour (pages sans hero). */
export default function DayMode() {
  useEffect(() => {
    document.documentElement.classList.add("is-day");
    return () => document.documentElement.classList.remove("is-day");
  }, []);
  return null;
}
