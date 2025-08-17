import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, User, Code, Briefcase, MapPin, Calendar, Award } from 'lucide-react'
import { getSystemSettings } from '@/lib/database'
import type { SystemSetting } from '@/lib/types'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { getDictionary } from '@/lib/i18n/dictionaries'

export default async function AboutPage({
  params: { locale = 'zh' }
}: {
  params: { locale?: 'zh' | 'en' }
}) {
  const dict = await getDictionary(locale)
  // 获取用户信息用于Header
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }
  // 获取系统设置中的关于我信息
  const settings = await getSystemSettings([
    'about_title',
    'about_intro', 
    'about_email',
    'about_skills',
    'about_experience',
    'about_contact_welcome'
  ])
  
  // 将设置数组转换为对象格式
  const settingsObj = settings.reduce((acc: Record<string, string>, setting: SystemSetting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)
  
  const skills = settingsObj.about_skills ? settingsObj.about_skills.split(',').map((s: string) => s.trim()) : []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header user={user} profile={profile} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary mb-6 animate-pulse">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {settingsObj.about_title || dict?.about?.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {settingsObj.about_intro || dict?.about?.noIntro}
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* 左侧列 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 技能专长卡片 */}
            {skills.length > 0 && (
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    {dict?.about?.skills}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skills.map((skill: string, index: number) => (
                      <div key={index} className="group/skill">
                        <Badge 
                          variant="secondary" 
                          className="w-full justify-center py-2 px-4 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 group-hover/skill:scale-105"
                        >
                          {skill}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 工作经验卡片 */}
            {settingsObj.about_experience && (
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    {dict?.about?.experience}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="leading-relaxed">
                      {settingsObj.about_experience}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        
          {/* 右侧列 */}
          <div className="space-y-8">
            {/* 联系方式卡片 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  {dict?.about?.contact}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsObj.about_contact_welcome && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                    <p className="text-muted-foreground leading-relaxed">
                      {settingsObj.about_contact_welcome}
                    </p>
                  </div>
                )}
                {settingsObj.about_email && (
                  <div className="group/email">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300">
                      <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{dict?.about?.emailAddress}</p>
                        <a 
                          href={`mailto:${settingsObj.about_email}`}
                          className="text-primary hover:text-primary/80 font-medium transition-colors group-hover/email:underline"
                        >
                          {settingsObj.about_email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 额外信息卡片 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{dict?.about?.certification}</p>
                      <p className="text-xs text-muted-foreground">{dict?.about?.fullStackEngineer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{dict?.about?.location}</p>
                      <p className="text-xs text-muted-foreground">{dict?.about?.remote}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">{dict?.about?.workStatus}</p>
                      <p className="text-xs text-muted-foreground">{dict?.about?.openToCollaboration}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}