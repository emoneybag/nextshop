"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const KEY = "nextshop:theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Resolve after mount so server and client HTML match.
    const explicit = document.documentElement.dataset.theme as Theme | undefined;
    const system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(explicit ?? system);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-full transition hover:bg-surface-2"
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      {theme === "light" ? <Moon className="size-5" /> : theme === "dark" ? <Sun className="size-5" /> : null}
    </button>
  );
}
