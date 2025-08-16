// 上传图片到Supabase Storage（通过API路由）
export async function uploadImage(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '上传失败')
    }
    
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// 从剪贴板数据中提取图片文件
export function extractImagesFromClipboard(items: DataTransferItemList) {
  const images: File[] = []
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        images.push(file)
      }
    }
  }
  
  return images
}