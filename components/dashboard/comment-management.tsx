"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Calendar, ExternalLink } from "lucide-react"
import { updateCommentStatus } from "@/lib/comment-actions"
import Link from "next/link"

interface CommentManagementProps {
  comments: any[]
}

export function CommentManagement({ comments }: CommentManagementProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleStatusUpdate = async (commentId: string, status: "approved" | "rejected") => {
    setLoadingStates((prev) => ({ ...prev, [commentId]: true }))
    try {
      await updateCommentStatus(commentId, status)
    } catch (error) {
      alert("操作失败，请重试")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  const pendingComments = comments.filter((c) => c.status === "pending")
  const approvedComments = comments.filter((c) => c.status === "approved")
  const rejectedComments = comments.filter((c) => c.status === "rejected")

  const CommentCard = ({ comment }: { comment: any }) => {
    const authorName = comment.author?.full_name || comment.author?.username || "匿名用户"
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
                    {comment.status === "approved" ? "已通过" : comment.status === "pending" ? "待审核" : "已拒绝"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(comment.created_at).toLocaleDateString("zh-CN")}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap line-clamp-3">{comment.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>文章：</span>
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
                        通过
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(comment.id, "rejected")}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3 mr-1" />
                        拒绝
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
                      恢复
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
        <TabsTrigger value="all">全部 ({comments.length})</TabsTrigger>
        <TabsTrigger value="pending">待审核 ({pendingComments.length})</TabsTrigger>
        <TabsTrigger value="approved">已通过 ({approvedComments.length})</TabsTrigger>
        <TabsTrigger value="rejected">已拒绝 ({rejectedComments.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">还没有评论</p>
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
              <p className="text-muted-foreground">没有待审核的评论</p>
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
              <p className="text-muted-foreground">没有已通过的评论</p>
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
              <p className="text-muted-foreground">没有已拒绝的评论</p>
            </CardContent>
          </Card>
        ) : (
          rejectedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
