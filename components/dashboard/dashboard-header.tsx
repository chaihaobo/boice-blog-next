import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { PenTool, Home, MessageSquare } from "lucide-react"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

interface DashboardHeaderProps {
  user: {
    id: string
    email?: string
  }
  profile?: any
  locale: Locale
}

export async function DashboardHeader({ user, profile, locale }: DashboardHeaderProps) {
  const dict = await getDictionary(locale)
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Boice</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                {dict.dashboard.dashboard}
              </Link>
              <Link href="/dashboard/posts" className="text-sm font-medium transition-colors hover:text-primary">
                {dict.dashboard.postManagement}
              </Link>
              <Link href="/dashboard/comments" className="text-sm font-medium transition-colors hover:text-primary">
                {dict.dashboard.commentManagement}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">{dict.navigation.backToHome}</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/posts/new">
                <PenTool className="h-4 w-4 mr-2" />
                {dict.dashboard.writeNewPost}
              </Link>
            </Button>
            <UserNav user={user} profile={profile} />
          </div>
        </div>
      </div>
    </header>
  )
}
