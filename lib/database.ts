import { createClient } from "@/lib/supabase/server"
import type { Post, Category, Tag, Comment } from "@/lib/types"

export async function getPosts({
  status = "published",
  limit = 10,
  offset = 0,
  categoryId,
  tagId,
  authorId,
}: {
  status?: "published" | "draft" | "archived"
  limit?: number
  offset?: number
  categoryId?: string
  tagId?: string
  authorId?: string
} = {}) {
  const supabase = createClient()

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", status)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  if (authorId) {
    query = query.eq("author_id", authorId)
  }

  if (tagId) {
    // Use a subquery for tag filtering
    const { data: postIds } = await supabase.from("post_tags").select("post_id").eq("tag_id", tagId)

    if (postIds && postIds.length > 0) {
      const ids = postIds.map((item) => item.post_id)
      query = query.in("id", ids)
    } else {
      // No posts found with this tag
      return []
    }
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  if (!posts || posts.length === 0) {
    return []
  }

  const postsWithRelations = await Promise.all(
    posts.map(async (post) => {
      const [authorData, categoryData, tagsData] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", post.author_id).single(),
        post.category_id
          ? supabase.from("categories").select("*").eq("id", post.category_id).single()
          : Promise.resolve({ data: null }),
        supabase
          .from("post_tags")
          .select(`
            tags (
              id,
              name,
              slug,
              color
            )
          `)
          .eq("post_id", post.id),
      ])

      return {
        ...post,
        profiles: authorData.data,
        categories: categoryData.data,
        post_tags: tagsData.data || [],
      }
    }),
  )

  return postsWithRelations as Post[]
}

export async function getPostBySlug(slug: string) {
  const supabase = createClient()

  const { data: postData, error: postError } = await supabase.from("posts").select("*").eq("slug", slug).single()

  if (postError || !postData) {
    console.error("Error fetching post:", postError)
    return null
  }

  const [authorData, categoryData, tagsData] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", postData.author_id).single(),
    postData.category_id
      ? supabase.from("categories").select("*").eq("id", postData.category_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("post_tags")
      .select(`
        tags (
          id,
          name,
          slug,
          color
        )
      `)
      .eq("post_id", postData.id),
  ])

  const data = {
    ...postData,
    profiles: authorData.data,
    categories: categoryData.data,
    post_tags: tagsData.data || [],
  }

  return data as Post
}

export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export async function getTags() {
  const supabase = createClient()

  const { data, error } = await supabase.from("tags").select("*").order("name")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  return data as Tag[]
}

export async function getComments(postSlug: string) {
  const supabase = createClient()

  // First get the post ID from slug
  const { data: post } = await supabase.from("posts").select("id").eq("slug", postSlug).single()

  if (!post) {
    return []
  }

  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .is("parent_id", null)
    .order("created_at", { ascending: true })

  if (commentsError) {
    console.error("Error fetching comments:", commentsError)
    return []
  }

  if (!commentsData || commentsData.length === 0) {
    return []
  }

  const commentsWithAuthors = await Promise.all(
    commentsData.map(async (comment) => {
      const { data: authorData } = await supabase.from("profiles").select("*").eq("id", comment.author_id).single()

      return {
        ...comment,
        profiles: authorData,
      }
    }),
  )

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    commentsWithAuthors.map(async (comment) => {
      const { data: repliesData } = await supabase
        .from("comments")
        .select("*")
        .eq("parent_id", comment.id)
        .eq("status", "approved")
        .order("created_at", { ascending: true })

      const replies = await Promise.all(
        (repliesData || []).map(async (reply) => {
          const { data: authorData } = await supabase.from("profiles").select("*").eq("id", reply.author_id).single()

          return {
            ...reply,
            profiles: authorData,
          }
        }),
      )

      return {
        ...comment,
        replies: replies || [],
      }
    }),
  )

  return commentsWithReplies as Comment[]
}

export async function createPost(data: {
  title: string
  content: string
  excerpt?: string
  categoryId?: string
  tagIds?: string[]
  status?: "draft" | "published"
  authorId: string
}) {
  const supabase = createClient()

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
      slug,
      content: data.content,
      excerpt: data.excerpt,
      category_id: data.categoryId,
      status: data.status || "draft",
      author_id: data.authorId,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (postError) {
    console.error("Error creating post:", postError)
    throw postError
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
    }
  }

  return post
}
