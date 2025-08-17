"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Save, Eye } from "lucide-react"
import { createPost } from "@/lib/post-actions"
import type { Category, Tag } from "@/lib/types"
import MDEditor from '@uiw/react-md-editor'
import { ImageUploader } from "@/components/posts/image-uploader"
import { ImageGallery } from "@/components/posts/image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface PostEditorProps {
  categories: Category[]
  tags: Tag[]
  userId: string
  post?: any // For editing existing posts
}

export function PostEditor({ categories, tags, userId, post }: PostEditorProps) {
  const router = useRouter()
  const { locale } = useI18n()
  const [dict, setDict] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    categoryId: post?.category_id || "",
    selectedTags: post?.tags?.map((t: any) => t.tag.id) || [],
  })

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) return null

  const handleTagToggle = (tagId: string) => {
      setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id: string) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }))
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert(dict.validation.titleAndContentRequired)
      return
    }

    setIsLoading(true)
    try {
      await createPost({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        categoryId: formData.categoryId || undefined,
        tagIds: formData.selectedTags,
        status,
        authorId: userId,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving post:", error)
      alert(dict.editor.saveError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.editor.postInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{dict.editor.title}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={dict.editor.titlePlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="excerpt">{dict.editor.excerpt}</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder={dict.editor.excerptPlaceholder}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">{dict.editor.category}</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={dict.editor.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{dict.editor.tags}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={formData.selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                  {formData.selectedTags.includes(tag.id) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dict.editor.content}</CardTitle>
        </CardHeader>
                  <CardContent>
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="write">{dict.tabs.write}</TabsTrigger>
                <TabsTrigger value="upload">{dict.tabs.upload}</TabsTrigger>
                <TabsTrigger value="gallery">{dict.tabs.gallery}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="space-y-4">
                <div data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData((prev) => ({ ...prev, content: value || '' }))}
                    height={500}
                    preview="edit"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <ImageUploader 
                  onImageUploaded={(imageUrl) => {
                    // 在光标位置插入Markdown图片语法
                    const imageMarkdown = `![${dict.imageGallery.image}](${imageUrl})\n`
                    
                    // 获取编辑器实例，尝试在光标位置插入图片
                    const textArea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
                    
                    if (textArea) {
                      const start = textArea.selectionStart
                      const end = textArea.selectionEnd
                      const text = formData.content || ''
                      
                      const newContent = text.substring(0, start) + imageMarkdown + text.substring(end)
                      setFormData((prev) => ({ ...prev, content: newContent }))
                      
                      // 设置光标位置到插入的图片后面
                      setTimeout(() => {
                        textArea.focus()
                        const newPosition = start + imageMarkdown.length
                        textArea.setSelectionRange(newPosition, newPosition)
                      }, 0)
                    } else {
                      // 如果无法获取编辑器实例，则追加到内容末尾
                      setFormData((prev) => ({
                        ...prev,
                        content: prev.content ? prev.content + imageMarkdown : imageMarkdown
                      }))
                    }
                    
                    // 显示成功提示并切换到写作标签
                    setTimeout(() => {
                      const writeTab = document.querySelector('[value="write"]') as HTMLButtonElement
                      if (writeTab) {
                        writeTab.click()
                      }
                    }, 1000)
                  }}
                />
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4">
                <ImageGallery 
                  showSelectButton={true}
                  onImageSelect={(imageUrl) => {
                    // 插入选中的图片
                    const imageMarkdown = `![${dict.imageGallery.image}](${imageUrl})\n`
                    setFormData((prev) => ({
                      ...prev,
                      content: prev.content ? prev.content + imageMarkdown : imageMarkdown
                    }))
                    
                    // 切换到写作标签
                    const writeTab = document.querySelector('[value="write"]') as HTMLButtonElement
                    if (writeTab) {
                      writeTab.click()
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => handleSave("draft")} disabled={isLoading} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          {dict.editor.saveDraft}
        </Button>
        <Button onClick={() => handleSave("published")} disabled={isLoading}>
          <Eye className="h-4 w-4 mr-2" />
          {dict.editor.publish}
        </Button>
      </div>
    </div>
  )
}
