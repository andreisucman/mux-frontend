"use client";

import { useComputedColorScheme } from "@mantine/core";
import { useEffect } from "react";

export default function ThemeMetaTags() {
  const theme = useComputedColorScheme("light");

  useEffect(() => {
    const isDark = theme === "dark";
    const themeColor = isDark ? "#2e2e2e" : "#ffffff";

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("theme-color", themeColor);
    setMeta("msapplication-navbutton-color", themeColor);
    setMeta("apple-mobile-web-app-status-bar-style", isDark ? "black-translucent" : "default");
  }, [theme]);

  return null;
}
