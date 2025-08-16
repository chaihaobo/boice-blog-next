import { getPostBySlug, getComments } from "@/lib/database"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostContent } from "@/components/posts/post-content"
import { CommentSection } from "@/components/comments/comment-section"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "文章未找到",
    }
  }

  return {
    title: `${post.title} - Boice Blog`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author?.full_name || post.author?.username || ""],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const [post, comments] = await Promise.all([getPostBySlug(params.slug), getComments(params.slug)])

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil(post.content.split(" ").length / 200)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <Badge style={{ backgroundColor: post.category.color + "20", color: post.category.color }}>
                  {post.category.name}
                </Badge>
              )}
              {post.tags?.map((tagItem: any) => (
                <Badge key={tagItem.tag.id} variant="outline">
                  {tagItem.tag.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-muted-foreground">{post.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author?.full_name || post.author?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString("zh-CN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} 分钟阅读</span>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <PostContent content={post.content} />

          {/* Comments */}
          <div className="mt-16">
            <CommentSection postId={post.id} comments={comments} user={user} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
