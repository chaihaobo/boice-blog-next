"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Category, Tag } from "@/lib/types"

interface PostFiltersProps {
  categories: Category[]
  tags: Tag[]
}

export function PostFilters({ categories, tags }: PostFiltersProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")
  const selectedTag = searchParams.get("tag")
  const [dict, setDict] = useState<any>(null)
  const { locale } = useI18n()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{dict.posts.categories}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant={!selectedCategory ? "default" : "ghost"} size="sm" asChild className="w-full justify-start">
            <Link href="/posts">{dict.posts.all}</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link href={`/posts?category=${category.id}`}>
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                {category.name}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{dict.posts.tags}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.id ? "default" : "outline"}
                className="cursor-pointer"
                asChild
              >
                <Link href={`/posts?tag=${tag.id}`}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
