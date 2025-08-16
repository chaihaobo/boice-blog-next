"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(data: {
  title: string
  content: string
  excerpt?: string
  categoryId?: string
  tagIds?: string[]
  status?: "draft" | "published"
  authorId: string
}) {
  const supabase = await createClient()

  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  // Create post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 200) + "...",
      slug,
      category_id: data.categoryId || null,
      author_id: data.authorId,
      status: data.status || "draft",
      published_at: data.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (postError) {
    console.error("Error creating post:", postError)
    throw new Error("创建文章失败")
  }

  // Add tags if provided
  if (data.tagIds && data.tagIds.length > 0) {
    const tagInserts = data.tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

    if (tagError) {
      console.error("Error adding tags:", tagError)
      // Don't throw here, post was created successfully
    }
  }

  // Revalidate relevant paths
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/dashboard")

  return post
}

export async function updatePost(
  postId: string,
  data: {
    title: string
    content: string
    excerpt?: string
    categoryId?: string
    tagIds?: string[]
    status?: "draft" | "published"
  }
) {
  const supabase = await createClient()

  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  // Update post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .update({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 200) + "...",
      slug,
      category_id: data.categoryId || null,
      status: data.status || "draft",
      published_at: data.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select()
    .single()

  if (postError) {
    console.error("Error updating post:", postError)
    throw new Error("更新文章失败")
  }

  // Update tags
  if (data.tagIds !== undefined) {
    // First, remove existing tags
    await supabase.from("post_tags").delete().eq("post_id", postId)

    // Then add new tags
    if (data.tagIds.length > 0) {
      const tagInserts = data.tagIds.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

      if (tagError) {
        console.error("Error updating tags:", tagError)
      }
    }
  }

  // Revalidate relevant paths
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/dashboard")
  revalidatePath(`/posts/${post.slug}`)

  return post
}

export async function deletePost(postId: string) {
  const supabase = await createClient()

  // First delete related tags
  await supabase.from("post_tags").delete().eq("post_id", postId)

  // Then delete the post
  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) {
    console.error("Error deleting post:", error)
    throw new Error("删除文章失败")
  }

  // Revalidate relevant paths
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/dashboard")
}
