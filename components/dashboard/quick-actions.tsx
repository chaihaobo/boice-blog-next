import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenTool, Settings, BarChart3, Users } from "lucide-react"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

export async function QuickActions({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)
  const actions = [
    {
      title: dict.dashboard.writeNewPost,
      description: dict.dashboard.createNewPost,
      href: "/dashboard/posts/new",
      icon: PenTool,
    },
    {
      title: dict.dashboard.viewStats,
      description: dict.dashboard.viewBlogStats,
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: dict.dashboard.manageComments,
      description: dict.dashboard.reviewComments,
      href: "/dashboard/comments",
      icon: Users,
    },
    {
      title: dict.dashboard.settings,
      description: dict.dashboard.blogSettings,
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.dashboard.quickActions}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button key={action.href} variant="ghost" className="w-full justify-start h-auto p-4" asChild>
            <Link href={action.href}>
              <div className="flex items-start gap-3">
                <action.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
