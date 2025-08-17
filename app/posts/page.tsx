import { getPosts, getCategories, getTags } from "@/lib/database"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/posts/post-card"
import { PostFilters } from "@/components/posts/post-filters"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { PostCardSkeleton } from "@/components/posts/post-card-skeleton"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface PostsPageProps {
  searchParams: {
    category?: string
    tag?: string
    page?: string
  }
}

export default async function PostsPage({ 
  searchParams,
  params: { locale = 'zh' }
}: PostsPageProps & {
  params: { locale?: 'zh' | 'en' }
}) {
  const dict = await getDictionary(locale)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  const [posts, categories, tags] = await Promise.all([
    getPosts({
      limit,
      offset,
      categoryId: searchParams.category,
      tagId: searchParams.tag,
    }),
    getCategories(),
    getTags(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <PostFilters categories={categories} tags={tags} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{dict?.posts?.allPosts}</h1>
                <p className="text-muted-foreground mt-2">{dict?.posts?.exploreInsights}</p>
              </div>
            </div>

            <Suspense fallback={<PostGridSkeleton />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </Suspense>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{dict?.posts?.noPosts}</p>
              </div>
            )}

            {/* Pagination */}
            {posts.length === limit && (
              <div className="flex justify-center mt-12">
                <Button variant="outline" asChild>
                  <a href={`/posts?page=${page + 1}`}>{dict?.posts?.loadMore}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
