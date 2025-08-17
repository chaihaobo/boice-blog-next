"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [dict, setDict] = useState<any>(null)
  const { locale } = useI18n()
  const readingTime = Math.ceil(post.content.split(" ").length / 200)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-1">
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.published_at || post.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime} {dict.posts.minutes}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comments_count || 0}
          </div>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tagItem: any) => (
              <Badge key={tagItem.tag.id} variant="outline" className="text-xs">
                {tagItem.tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
