export interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: "draft" | "published" | "archived"
  author_id: string
  category_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  author?: Profile
  category?: Category
  tags?: Tag[]
  comments_count?: number
}

export interface Comment {
  id: string
  content: string
  author_id: string
  post_id: string
  parent_id?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  author?: Profile
  replies?: Comment[]
}
