"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  // Prevent hydration mismatch by not rendering toggle icon until mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#00D4FF]/20 bg-background opacity-50">
        <span className="sr-only">Toggle theme loading</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#00D4FF]/20 bg-background hover:bg-[#00D4FF]/10 transition-colors text-foreground focus:outline-none"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
