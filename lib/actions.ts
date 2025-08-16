"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// GitHub OAuth sign in
export async function signInWithGitHub() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    console.error("GitHub sign in error:", error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

// Email and password sign in
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "表单数据缺失" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "邮箱和密码为必填项" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "登录时发生意外错误，请重试" }
  }
}

// Email and password sign up
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "表单数据缺失" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  if (!email || !password) {
    return { error: "邮箱和密码为必填项" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          full_name: fullName?.toString() || "",
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName?.toString() || "",
        username: email.toString().split("@")[0],
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return { success: "请检查您的邮箱以确认账户" }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "注册时发生意外错误，请重试" }
  }
}

// Sign out
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/")
}
