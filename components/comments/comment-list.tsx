import { CommentItem } from "./comment-item"
import type { Comment } from "@/lib/types"

interface CommentListProps {
  comments: Comment[]
  postId: string
  user?: {
    id: string
    email?: string
  } | null
}

export function CommentList({ comments, postId, user }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">还没有评论，来发表第一个评论吧！</p>
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
