import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { getDictionary } from "@/lib/i18n/dictionaries"

export default async function DashboardPage({
  params: { locale = 'zh' }
}: {
  params: { locale?: 'zh' | 'en' }
}) {
  const dict = await getDictionary(locale)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's posts stats
  const { data: posts } = await supabase
    .from("posts")
    .select("id, status, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const stats = {
    totalPosts: posts?.length || 0,
    publishedPosts: posts?.filter((p) => p.status === "published").length || 0,
    draftPosts: posts?.filter((p) => p.status === "draft").length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} locale={locale} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{dict?.dashboard?.title}</h1>
            <p className="text-muted-foreground">{dict?.dashboard?.manageBlog}</p>
          </div>

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentPosts userId={user.id} locale={locale} />
            </div>
            <div>
              <QuickActions locale={locale} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
