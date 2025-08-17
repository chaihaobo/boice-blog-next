"use client"

import Link from "next/link"
import { Github, Mail } from "lucide-react"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo size="sm" />
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
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {dict.common.about}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">{dict.footer.contact}</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <Link href="https://github.com/chaihaobo" className="text-muted-foreground hover:text-foreground text-sm">
                  chaihaobo
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Link href="mailto:chaihaobo@gmail.com" className="text-muted-foreground hover:text-foreground text-sm">
                  chaihaobo@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            © 2025 Boice Blog. {dict.footer.allRightsReserved}
          </p>
          <div className="flex items-center justify-center gap-1 text-xs">
            <span>{dict.footer.builtWith}</span>
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.146 4.318 16.956 1.669 13.94.394 13.114.134 12.208.026 11.572 0z"/>
              </svg>
              {dict.footer.nextjs}
            </a>
            <span>，{dict.footer.poweredBy}</span>
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 22.525H0l12-21.05 12 21.05z"/>
              </svg>
              {dict.footer.vercel}
            </a>
            <span>{dict.footer.platform}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
