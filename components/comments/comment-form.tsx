"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { createComment } from "@/lib/comment-actions"
import { useEffect, useRef } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          提交中...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          发表评论
        </>
      )}
    </Button>
  )
}

interface CommentFormProps {
  postId: string
  parentId?: string
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({ postId, parentId, onCancel, placeholder = "写下您的评论..." }: CommentFormProps) {
  const [state, formAction] = useActionState(createComment, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      if (onCancel) {
        onCancel()
      }
    }
  }, [state, onCancel])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{parentId ? "回复评论" : "发表评论"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />
          {parentId && <input type="hidden" name="parentId" value={parentId} />}

          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          <Textarea name="content" placeholder={placeholder} rows={4} required minLength={5} maxLength={1000} />

          <div className="flex items-center gap-2">
            <SubmitButton />
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                取消
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
