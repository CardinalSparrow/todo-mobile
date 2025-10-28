import { loadTheme, saveTheme } from "@/services/Storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

const lightColors = {
  background: "#f9fafb",
  card: "#ffffff",
  text: "#111827",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
};

const darkColors = {
  background: "#111827",
  card: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme().then(setIsDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveTheme(newTheme);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
