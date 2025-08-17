"use client"

import { useState, useEffect } from "react"
import { CommentItem } from "./comment-item"
import type { Comment } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface CommentListProps {
  comments: Comment[]
  postId: string
  user?: {
    id: string
    email?: string
  } | null
}

export function CommentList({ comments, postId, user }: CommentListProps) {
  const { locale } = useI18n()
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{dict.comments.noComments}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} user={user} />
      ))}
    </div>
  )
}
