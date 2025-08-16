import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  user?: {
    id: string
    email?: string
  } | null
}

export function CommentSection({ postId, comments, user }: CommentSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">评论 ({comments.length})</h2>
      </div>

      {user ? (
        <CommentForm postId={postId} />
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">登录后参与讨论</p>
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            立即登录
          </a>
        </div>
      )}

      <CommentList comments={comments} postId={postId} user={user} />
    </div>
  )
}
