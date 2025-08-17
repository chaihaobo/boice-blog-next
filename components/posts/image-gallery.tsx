"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Copy, Eye } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getDictionary } from '@/lib/i18n/dictionaries'

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
  const [dict, setDict] = useState<any>(null)
  const { locale } = useI18n()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/upload')
      
      if (!response.ok) {
        throw new Error(dict?.images?.loadFailed || 'Failed to load images')
      }
      
      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Error loading images:', error)
      setError(error instanceof Error ? error.message : dict?.images?.loadFailed || 'Failed to load images')
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
      toast.textContent = dict?.images?.urlCopied || 'Image URL copied to clipboard'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const copyMarkdownUrl = async (url: string, fileName: string) => {
    const markdown = `![${fileName}](${url})`
    try {
      await navigator.clipboard.writeText(markdown)
      // 显示复制成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50'
      toast.textContent = dict?.images?.markdownCopied || 'Markdown format copied to clipboard'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const deleteImage = async (path: string) => {
    if (!confirm(dict?.images?.confirmDelete || 'Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(dict?.images?.deleteFailed || 'Delete failed')
      }

      // 从列表中移除已删除的图片
      setImages(prev => prev.filter(img => img.path !== path))
      
      // 显示删除成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50'
      toast.textContent = dict?.images?.deleted || 'Image deleted'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('Delete failed:', error)
      alert(dict?.images?.deleteFailedRetry || 'Delete failed, please try again')
    }
  }

  if (!dict) return null

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dict.images.myImages}</CardTitle>
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
          <CardTitle>{dict.images.myImages}</CardTitle>
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
              {dict.images.retry}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.images.myImages} ({images.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {dict.images.noImages}
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
                      title={dict.images.copyUrl}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyMarkdownUrl(image.url, image.name)}
                      title={dict.images.copyMarkdown}
                    >
                      MD
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.path)}
                      title={dict.images.deleteImage}
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
