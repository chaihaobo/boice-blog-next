"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Copy, Eye } from 'lucide-react'

interface ImageItem {
  name: string
  url: string
  path: string
  created_at: string
  last_accessed_at: string
  metadata: any
}

interface ImageGalleryProps {
  onImageSelect?: (imageUrl: string) => void
  showSelectButton?: boolean
}

export function ImageGallery({ onImageSelect, showSelectButton = false }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/upload')
      
      if (!response.ok) {
        throw new Error('获取图片列表失败')
      }
      
      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Error loading images:', error)
      setError(error instanceof Error ? error.message : '加载图片失败')
    } finally {
      setIsLoading(false)
    }
  }

  const copyImageUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // 显示复制成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50'
      toast.textContent = '图片URL已复制到剪贴板'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const copyMarkdownUrl = async (url: string, fileName: string) => {
    const markdown = `![${fileName}](${url})`
    try {
      await navigator.clipboard.writeText(markdown)
      // 显示复制成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50'
      toast.textContent = 'Markdown格式已复制到剪贴板'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const deleteImage = async (path: string) => {
    if (!confirm('确定要删除这张图片吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      // 从列表中移除已删除的图片
      setImages(prev => prev.filter(img => img.path !== path))
      
      // 显示删除成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50'
      toast.textContent = '图片已删除'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>我的图片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>我的图片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            {error}
            <Button 
              onClick={loadImages} 
              variant="outline" 
              size="sm" 
              className="ml-2"
            >
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>我的图片 ({images.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            还没有上传任何图片
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.path} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex gap-1">
                    {showSelectButton && onImageSelect && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onImageSelect(image.url)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyImageUrl(image.url)}
                      title="复制图片URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyMarkdownUrl(image.url, image.name)}
                      title="复制Markdown格式"
                    >
                      MD
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.path)}
                      title="删除图片"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
