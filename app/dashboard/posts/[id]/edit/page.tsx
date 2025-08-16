import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EditPostEditor } from "@/components/dashboard/edit-post-editor"
import { getCategories, getTags } from "@/lib/database"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient()
  
  // 获取用户信息
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // 获取文章信息
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .eq("id", params.id)
    .single()

  if (postError || !post) {
    notFound()
  }

  // 验证用户权限 - 只有文章作者可以编辑
  if (post.author_id !== user.id) {
    redirect("/dashboard")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">编辑文章</h1>
            <p className="text-muted-foreground">修改并更新您的文章</p>
          </div>

          <EditPostEditor
            post={post}
            categories={categories}
            tags={tags}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  )
}