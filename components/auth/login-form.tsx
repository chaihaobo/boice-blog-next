"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, signInWithGitHub } from "@/lib/actions"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Dictionary } from "@/lib/i18n/dictionaries"

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {dict.auth.signingIn}
        </>
      ) : (
        dict.auth.signIn
      )}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const { locale } = useI18n()
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{dict.auth.or}</span>
          </div>
        </div>

        {/* Email/Password Login */}
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{dict.auth.email}</Label>
            <Input id="email" name="email" type="email" placeholder="your@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{dict.auth.password}</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <SubmitButton dict={dict} />
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {dict.auth.noAccount}{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            {dict.auth.signUpNow}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
