import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "solvedoku-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still applies for the current session if storage is unavailable.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  let savedTheme: string | null = null;

  try {
    savedTheme = localStorage.getItem(STORAGE_KEY);
  } catch {
    savedTheme = null;
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
