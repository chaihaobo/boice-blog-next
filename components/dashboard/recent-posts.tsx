import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Edit } from "lucide-react"

interface RecentPostsProps {
  userId: string
}

export async function RecentPosts({ userId }: RecentPostsProps) {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("author_id", userId)
    .order("updated_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>最近文章</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/posts">查看全部</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium line-clamp-1">{post.title}</h3>
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status === "published" ? "已发布" : "草稿"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.updated_at).toLocaleDateString("zh-CN")}
                </div>
                {post.category && <span style={{ color: post.category.color }}>{post.category.name}</span>}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/posts/${post.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}

        {!posts?.length && (
          <div className="text-center py-8 text-muted-foreground">
            <p>还没有文章</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/posts/new">写第一篇文章</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
