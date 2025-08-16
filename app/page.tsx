import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  // Get recent published posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(*),
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Boice</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">分享技术见解、生活感悟和个人思考的地方</p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/posts">浏览文章</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">关于我</Link>
            </Button>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">最新文章</h2>
            <Button variant="ghost" asChild>
              <Link href="/posts">查看全部 →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post: any) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {post.category && (
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: post.category.color + "20", color: post.category.color }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.published_at).toLocaleDateString("zh-CN")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />0
                    </div>
                  </div>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tagItem: any) => (
                        <Badge key={tagItem.tag.id} variant="outline" className="text-xs">
                          {tagItem.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
