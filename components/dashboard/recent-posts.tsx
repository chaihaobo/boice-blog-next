import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Edit } from "lucide-react"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

interface RecentPostsProps {
  userId: string
  locale: Locale
}

export async function RecentPosts({ userId, locale }: RecentPostsProps) {
  const supabase = await createClient()
  const dict = await getDictionary(locale)

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories!fk_posts_category(*)
    `)
    .eq("author_id", userId)
    .order("updated_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent posts:', error)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{dict.dashboard.recentPosts}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/posts">{dict.dashboard.viewAll}</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium line-clamp-1">{post.title}</h3>
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status === "published" ? dict.dashboard.published : dict.dashboard.draft}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.updated_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
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
            <p>{dict.dashboard.noPosts}</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/posts/new">{dict.dashboard.writeFirstPost}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
