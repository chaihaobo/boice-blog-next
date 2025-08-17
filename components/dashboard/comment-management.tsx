"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Calendar, ExternalLink } from "lucide-react"
import { updateCommentStatus } from "@/lib/comment-actions"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface CommentManagementProps {
  comments: any[]
}

export function CommentManagement({ comments }: CommentManagementProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [dict, setDict] = useState<any>(null)
  const { locale } = useI18n()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  const handleStatusUpdate = async (commentId: string, status: "approved" | "rejected") => {
    setLoadingStates((prev) => ({ ...prev, [commentId]: true }))
    try {
      await updateCommentStatus(commentId, status)
    } catch (error) {
      alert(dict.comments.operationFailed)
    } finally {
      setLoadingStates((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  const pendingComments = comments.filter((c) => c.status === "pending")
  const approvedComments = comments.filter((c) => c.status === "approved")
  const rejectedComments = comments.filter((c) => c.status === "rejected")

  const CommentCard = ({ comment }: { comment: any }) => {
    const authorName = comment.author?.full_name || comment.author?.username || dict.comments.anonymousUser
    const isLoading = loadingStates[comment.id]

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{authorName}</span>
                  <Badge
                    variant={
                      comment.status === "approved"
                        ? "default"
                        : comment.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {comment.status === "approved" ? dict.comments.approved : comment.status === "pending" ? dict.comments.pending : dict.comments.rejected}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(comment.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap line-clamp-3">{comment.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{dict.comments.post}：</span>
                  <Link
                    href={`/posts/${comment.post.slug}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {comment.post.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {comment.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(comment.id, "approved")}
                        disabled={isLoading}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {dict.comments.approve}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(comment.id, "rejected")}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3 mr-1" />
                        {dict.comments.reject}
                      </Button>
                    </>
                  )}
                  {comment.status === "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(comment.id, "approved")}
                      disabled={isLoading}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      {dict.comments.restore}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList>
        <TabsTrigger value="all">{dict.comments.all} ({comments.length})</TabsTrigger>
        <TabsTrigger value="pending">{dict.comments.pending} ({pendingComments.length})</TabsTrigger>
        <TabsTrigger value="approved">{dict.comments.approved} ({approvedComments.length})</TabsTrigger>
        <TabsTrigger value="rejected">{dict.comments.rejected} ({rejectedComments.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{dict.comments.noComments}</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        {pendingComments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{dict.comments.noPendingComments}</p>
            </CardContent>
          </Card>
        ) : (
          pendingComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </TabsContent>

      <TabsContent value="approved" className="space-y-4">
        {approvedComments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{dict.comments.noApprovedComments}</p>
            </CardContent>
          </Card>
        ) : (
          approvedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4">
        {rejectedComments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{dict.comments.noRejectedComments}</p>
            </CardContent>
          </Card>
        ) : (
          rejectedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
