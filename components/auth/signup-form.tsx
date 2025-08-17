"use client"

import { useActionState, useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Github } from "lucide-react"
import Link from "next/link"
import { signUp, signInWithGitHub } from "@/lib/actions"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"

function SubmitButton({ dict }: { dict: any }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {dict.auth.signingUp}
        </>
      ) : (
        dict.auth.signUp
      )}
    </Button>
  )
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)
  const [dict, setDict] = useState<any>(null)
  const { locale } = useI18n()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{dict.auth.createAccount}</CardTitle>
        <CardDescription className="text-center">{dict.auth.signUpToStart}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GitHub Login */}
        <form action={signInWithGitHub}>
          <Button type="submit" variant="outline" className="w-full bg-transparent">
            <Github className="mr-2 h-4 w-4" />
            {dict.auth.signUpWithGitHub}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{dict.common.or}</span>
          </div>
        </div>

        {/* Email/Password Signup */}
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">{dict.auth.fullName}</Label>
            <Input id="fullName" name="fullName" type="text" placeholder={dict.auth.fullNamePlaceholder} />
          </div>

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
          {dict.auth.alreadyHaveAccount}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {dict.auth.loginNow}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
