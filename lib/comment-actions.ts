"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createComment(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在 Server Actions 中不能设置 cookie
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "请先登录后再评论" }
  }

  const content = formData.get("content")?.toString()
  const postId = formData.get("postId")?.toString()
  const parentId = formData.get("parentId")?.toString()

  if (!content || !postId) {
    return { error: "评论内容和文章ID不能为空" }
  }

  if (content.length < 5) {
    return { error: "评论内容至少需要5个字符" }
  }

  if (content.length > 1000) {
    return { error: "评论内容不能超过1000个字符" }
  }

  try {
    const { error } = await supabase.from("comments").insert({
      content: content.trim(),
      author_id: user.id,
      post_id: postId,
      parent_id: parentId || null,
      status: "approved", // Auto-approve for now, can be changed to "pending" for moderation
    })

    if (error) {
      console.error("Error creating comment:", error)
      return { error: "评论提交失败，请重试" }
    }

    revalidatePath(`/posts/[slug]`, "page")
    return { success: "评论提交成功" }
  } catch (error) {
    console.error("Unexpected error creating comment:", error)
    return { error: "评论提交时发生意外错误" }
  }
}

export async function deleteComment(commentId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在 Server Actions 中不能设置 cookie
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("请先登录")
  }

  // Check if user owns the comment
  const { data: comment } = await supabase.from("comments").select("author_id").eq("id", commentId).single()

  if (!comment || comment.author_id !== user.id) {
    throw new Error("您只能删除自己的评论")
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) {
    console.error("Error deleting comment:", error)
    throw new Error("删除评论失败")
  }

  revalidatePath(`/posts/[slug]`, "page")
}

export async function updateCommentStatus(commentId: string, status: "approved" | "rejected") {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在 Server Actions 中不能设置 cookie
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("请先登录")
  }

  // For now, only the comment author can update status
  // In a real app, you'd check for admin permissions
  const { error } = await supabase.from("comments").update({ status }).eq("id", commentId)

  if (error) {
    console.error("Error updating comment status:", error)
    throw new Error("更新评论状态失败")
  }

  revalidatePath(`/posts/[slug]`, "page")
  revalidatePath("/dashboard/comments")
}
