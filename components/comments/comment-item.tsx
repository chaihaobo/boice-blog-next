"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Reply, Trash2, Calendar } from "lucide-react"
import { CommentForm } from "./comment-form"
import { deleteComment } from "@/lib/comment-actions"
import type { Comment } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface CommentItemProps {
  comment: Comment
  postId: string
  user?: {
    id: string
    email?: string
  } | null
  isReply?: boolean
}

export function CommentItem({ comment, postId, user, isReply = false }: CommentItemProps) {
  const { locale } = useI18n()
  const [dict, setDict] = useState<any>(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  const handleDelete = async () => {
    if (!confirm(dict.comments.confirmDelete)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteComment(comment.id)
    } catch (error) {
      alert(dict.comments.deleteError)
    } finally {
      setIsDeleting(false)
    }
  }

  const authorName = comment.author?.full_name || comment.author?.username || dict.comments.anonymous
  const isOwner = user?.id === comment.author_id

  return (
    <div className={`space-y-4 ${isReply ? "ml-8" : ""}`}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{authorName}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(comment.created_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {user && !isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="h-8 px-2"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    {dict.comments.reply}
                  </Button>
                )}

                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {isDeleting ? dict.comments.deleting : dict.comments.delete}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {showReplyForm && user && (
        <div className="ml-8">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`${dict.comments.replyTo} ${authorName}...`}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} user={user} isReply />
          ))}
        </div>
      )}
    </div>
  )
}
