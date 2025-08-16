"use client"

import Link from "next/link"
import { Github, Mail, Rss } from "lucide-react"
import { Logo } from "@/components/logo"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { useEffect, useState } from "react"
import type { Dictionary } from "@/lib/i18n/dictionaries"

export function Footer() {
  const { locale } = useI18n()
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">{dict.footer.blogDescription}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">{dict.footer.navigation}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                  {dict.common.posts}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  {dict.common.categories}
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-muted-foreground hover:text-foreground">
                  {dict.common.tags}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {dict.common.about}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">{dict.footer.contact}</h4>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="mailto:contact@example.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="/rss" className="text-muted-foreground hover:text-foreground">
                <Rss className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">{dict.footer.other}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {dict.footer.termsOfService}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Boice Blog. {dict.footer.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}
