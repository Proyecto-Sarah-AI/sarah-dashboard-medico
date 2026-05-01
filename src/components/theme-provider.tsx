import * as React from "react"
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
  type ThemeProviderProps,
} from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme()

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return { theme, toggleTheme }
}