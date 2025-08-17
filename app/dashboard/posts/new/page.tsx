import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCategories, getTags } from "@/lib/database"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PostEditor } from "@/components/posts/post-editor"
import { getDictionary } from "@/lib/i18n/dictionaries"

export default async function NewPostPage({
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

  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} locale={locale} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{dict?.posts?.writeNewPost}</h1>
            <p className="text-muted-foreground">{dict?.posts?.createAndPublish}</p>
          </div>

          <PostEditor categories={categories} tags={tags} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
