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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{dict.auth.welcomeBack}</CardTitle>
        <CardDescription className="text-center">{dict.auth.signInToAccount}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GitHub Login */}
        <form action={signInWithGitHub}>
          <Button type="submit" variant="outline" className="w-full bg-transparent">
            <Github className="mr-2 h-4 w-4" />
            {dict.auth.signInWithGitHub}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
