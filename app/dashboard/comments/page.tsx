import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CommentManagement } from "@/components/dashboard/comment-management"

export default async function CommentsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get comments on user's posts
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles(*),
      post:posts(title, slug)
    `)
    .in("post_id", supabase.from("posts").select("id").eq("author_id", user.id))
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">评论管理</h1>
            <p className="text-muted-foreground">管理您文章的评论</p>
          </div>

          <CommentManagement comments={comments || []} />
        </div>
      </main>
    </div>
  )
}
