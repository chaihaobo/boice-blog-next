import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  console.log("[v0] Auth callback received, code:", !!code)

  if (code) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      console.log("[v0] Code exchange result:", {
        hasUser: !!data.user,
        hasSession: !!data.session,
        error: error?.message,
      })

      if (error) {
        console.error("[v0] Auth callback error:", error)
        return NextResponse.redirect(`${origin}/auth/login?error=callback_error`)
      }

      // If user signed up with OAuth, create profile if it doesn't exist
      if (data.user) {
        console.log("[v0] User authenticated:", data.user.id)

        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()

        console.log("[v0] Existing profile:", !!existingProfile)

        if (!existingProfile) {
          const profileData = {
            id: data.user.id,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.user_metadata?.user_name ||
              "",
            username:
              data.user.user_metadata?.user_name ||
              data.user.user_metadata?.preferred_username ||
              data.user.email?.split("@")[0] ||
              "",
            avatar_url: data.user.user_metadata?.avatar_url || "",
          }

          console.log("[v0] Creating profile:", profileData)

          const { error: profileError } = await supabase.from("profiles").insert(profileData)

          if (profileError) {
            console.error("[v0] Profile creation error:", profileError)
          } else {
            console.log("[v0] Profile created successfully")
          }
        }
      }

      // Redirect to home page with success
      console.log("[v0] Redirecting to home page")
      return NextResponse.redirect(`${origin}/?auth=success`)
    } catch (error) {
      console.error("[v0] Unexpected auth callback error:", error)
      return NextResponse.redirect(`${origin}/auth/login?error=unexpected_error`)
    }
  }

  // No code provided, redirect to login
  console.log("[v0] No code provided, redirecting to login")
  return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
}
