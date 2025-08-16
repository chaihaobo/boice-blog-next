import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenTool, Settings, BarChart3, Users } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "写新文章",
      description: "创建新的博客文章",
      href: "/dashboard/posts/new",
      icon: PenTool,
    },
    {
      title: "查看统计",
      description: "查看博客数据统计",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "管理评论",
      description: "审核和管理评论",
      href: "/dashboard/comments",
      icon: Users,
    },
    {
      title: "设置",
      description: "博客和账户设置",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>快速操作</CardTitle>
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
