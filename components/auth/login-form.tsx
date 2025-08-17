'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github } from 'lucide-react'
import { useEffect, useState } from 'react'
import { signInWithGitHub } from '@/lib/actions'
import { useI18n } from '@/lib/i18n/context'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Dictionary } from '@/lib/i18n/dictionaries'

export function LoginForm() {
  const { locale } = useI18n()
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  return (
    <div className="w-full max-w-md">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4 shadow-lg animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-white"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M2 2l2 2" />
            <path d="M2 22l2-2" />
            <path d="M22 2l-2 2" />
            <path d="M22 22l-2-2" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Boice Blog
        </h1>
        <p className="text-muted-foreground mt-2">{dict?.auth?.welcomeToCreativeSpace}</p>
      </div>

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-bold">{dict.auth.welcomeBack}</CardTitle>
          <CardDescription>{dict.auth.signInToAccount}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GitHub Login */}
          <form action={signInWithGitHub}>
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full h-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            >
              <Github className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">{dict.auth.signInWithGitHub}</span>
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">{dict?.auth?.secureLogin}</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{dict?.auth?.secureAuth}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-purple-700 dark:text-purple-300">{dict?.auth?.quickLogin}</p>
            </div>
          </div>
        </CardContent>
      </Card>
     </div>
  )
}
