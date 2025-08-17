"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { useEffect, useState } from "react"
import type { Dictionary } from "@/lib/i18n/dictionaries"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { locale } = useI18n()
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !dict) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const themes = [
    {
      name: dict.theme.light,
      value: "light",
      icon: Sun,
    },
    {
      name: dict.theme.dark,
      value: "dark",
      icon: Moon,
    },
    {
      name: dict.theme.system,
      value: "system",
      icon: Monitor,
    },
  ]

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <CurrentIcon className="h-5 w-5" />
          <span className="sr-only">{dict.navigation.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.value

          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={isActive ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              {themeOption.name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
