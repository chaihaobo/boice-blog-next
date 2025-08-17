"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { uploadImage, extractImagesFromClipboard } from '@/lib/image-upload'
import { useI18n } from '@/lib/i18n/context'
import { getDictionary } from '@/lib/i18n/dictionaries'

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void
}

export function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dict, setDict] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { locale } = useI18n()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    await uploadAndInsertImage(files[0])
    
    // 清空文件输入，以便可以再次选择相同的文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // 处理拖放事件
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        uploadAndInsertImage(file)
      }
    }
  }
  
  const uploadAndInsertImage = async (file: File) => {
    try {
      setIsUploading(true)
      
      // 显示上传进度提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md z-50 flex items-center'
      toast.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>` + (dict?.images?.uploading || 'Uploading image...') + `</span>
      `
      document.body.appendChild(toast)
      
      const imageUrl = await uploadImage(file)
      onImageUploaded(imageUrl)
      
      // 上传成功提示
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50 flex items-center'
      toast.innerHTML = `
        <svg class="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>` + (dict?.images?.uploadSuccess || 'Image uploaded successfully') + `</span>
      `
      
      // 2秒后移除提示
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(dict?.images?.uploadFailed || 'Image upload failed, please try again')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      const images = extractImagesFromClipboard(e.clipboardData.items)
      if (images.length > 0) {
        e.preventDefault()
        uploadAndInsertImage(images[0])
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // 注册和清理粘贴事件监听器
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])
  
  return (
    <div 
      ref={dropZoneRef}
      className={`border-2 border-dashed rounded-md p-4 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? (dict?.images?.uploading || 'Uploading...') : (dict?.images?.uploadImage || 'Upload Image')}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          <ImageIcon className="h-3 w-3 inline-block mr-1" />
          {isDragging ? (dict?.images?.dropToUpload || 'Drop to upload image') : (dict?.images?.dragDropOrPaste || 'Drag and drop image here or paste image')}
        </p>
      </div>
    </div>
  )
}