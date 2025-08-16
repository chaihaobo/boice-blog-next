"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Github } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { useEffect, useState as useStateHook } from "react"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface HeaderProps {
  user?: {
    id: string
    email?: string
  }
  profile?: {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
    bio?: string
    website?: string
    created_at: string
    updated_at: string
  }
}

export function Header({ user, profile }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { locale } = useI18n()
  const [dict, setDict] = useStateHook<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  const navigation = [
    { name: dict.common.home, href: "/" },
    { name: dict.common.posts, href: "/posts" },
    { name: dict.common.categories, href: "/categories" },
    { name: dict.common.tags, href: "/tags" },
    { name: dict.common.about, href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Boice</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />

            <ThemeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">{dict.navigation.github}</span>
              </Link>
            </Button>

            {user ? (
              <UserNav user={user} profile={profile} />
            ) : (
              <Button asChild>
                <Link href="/auth/login">{dict.common.login}</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{dict.navigation.openMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
