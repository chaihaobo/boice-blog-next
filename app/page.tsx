import {createClient} from "@/lib/supabase/server"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import Link from "next/link"
import {Calendar, MessageCircle} from "lucide-react"
import {Header} from "@/components/header"
import {Footer} from "@/components/footer"

export default async function HomePage() {
    const supabase = await createClient()

    const {
        data: {user},
    } = await supabase.auth.getUser()
    console.log(user)
    let profile = null
    if (user) {
        const {data} = await supabase.from("profiles").select("*").eq("id", user.id).single()
        profile = data
    }

    // Get recent published posts
    const {data: postsData} = await supabase
        .from("posts")
        .select(`
      *,
      author:profiles(*),
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
        .eq("status", "published")
        .order("published_at", {ascending: false})
        .limit(6)

    // Add comments count to each post
    const posts = await Promise.all(
        (postsData || []).map(async (post) => {
            const { count } = await supabase
                .from("comments")
                .select("id", { count: "exact" })
                .eq("post_id", post.id)
                .eq("status", "approved")
            
            return {
                ...post,
                comments_count: count || 0
            }
        })
    )

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} profile={profile}/>

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="text-center py-8 md:py-12 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Welcome to <span className="text-primary">Boice</span>
                    </h1>
                    <div className="flex gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/posts">浏览文章</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/about">关于我</Link>
                        </Button>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-8 md:py-12 bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-2xl my-8">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                核心理念
                            </h2>
                            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 md:p-8 shadow-lg">
                            <blockquote className="text-lg md:text-xl leading-relaxed text-muted-foreground italic">
                                "计算机 | 程序 | CPU | 现实世界的本质是一个状态到另外一个状态的迁移。
                                <br className="hidden md:block" />
                                当我们记录好了每次状态的变化，我们就可以回放整个过程。"
                            </blockquote>
                            
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-background/50 rounded-lg border">
                                    <div className="text-2xl mb-2">💻</div>
                                    <div className="text-sm font-medium text-primary">计算机</div>
                                </div>
                                <div className="text-center p-4 bg-background/50 rounded-lg border">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <div className="text-sm font-medium text-primary">程序</div>
                                </div>
                                <div className="text-center p-4 bg-background/50 rounded-lg border">
                                    <div className="text-2xl mb-2">🔧</div>
                                    <div className="text-sm font-medium text-primary">CPU</div>
                                </div>
                                <div className="text-center p-4 bg-background/50 rounded-lg border">
                                    <div className="text-2xl mb-2">🌍</div>
                                    <div className="text-sm font-medium text-primary">现实世界</div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                    状态 A
                                </span>
                                <span className="text-primary">→</span>
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    状态 B
                                </span>
                                <span className="text-primary">→</span>
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                                    状态 C
                                </span>
                            </div>
                        </div>
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
                                                style={{
                                                    backgroundColor: post.category.color + "20",
                                                    color: post.category.color
                                                }}
                                            >
                                                {post.category.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="line-clamp-2">
                                        <Link href={`/posts/${post.slug}`}
                                              className="hover:text-primary transition-colors">
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4"/>
                                            {new Date(post.published_at).toLocaleDateString("zh-CN")}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4"/>
                                            {post.comments_count || 0}
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

            <Footer/>
        </div>
    )
}
