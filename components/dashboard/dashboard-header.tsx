import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { PenTool, Home, MessageSquare } from "lucide-react"

interface DashboardHeaderProps {
  user: {
    id: string
    email?: string
  }
  profile?: any
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
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
                仪表板
              </Link>
              <Link href="/dashboard/posts" className="text-sm font-medium transition-colors hover:text-primary">
                文章管理
              </Link>
              <Link href="/dashboard/comments" className="text-sm font-medium transition-colors hover:text-primary">
                评论管理
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">返回首页</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/posts/new">
                <PenTool className="h-4 w-4 mr-2" />
                写文章
              </Link>
            </Button>
            <UserNav user={user} profile={profile} />
          </div>
        </div>
      </div>
    </header>
  )
}
