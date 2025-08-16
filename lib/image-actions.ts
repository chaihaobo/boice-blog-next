"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadImageAction(formData: FormData) {
  const supabase = await createClient()
  
  // 获取当前用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("用户未登录")
  }
  
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error("没有文件被上传")
  }
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    throw new Error("只能上传图片文件")
  }
  
  // 验证文件大小（限制为 5MB）
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error("文件大小不能超过 5MB")
  }
  
  // 生成唯一的文件名
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  
  // 上传文件到用户专属文件夹
  const filePath = `${user.id}/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Upload error:', error)
    throw new Error(`上传失败: ${error.message}`)
  }
  
  // 获取公开URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path)
  
  return {
    url: publicUrl,
    path: data.path
  }
}

export async function deleteImageAction(imagePath: string) {
  const supabase = await createClient()
  
  // 获取当前用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("用户未登录")
  }
  
  // 验证用户只能删除自己的文件
  if (!imagePath.startsWith(`${user.id}/`)) {
    throw new Error("无权限删除此文件")
  }
  
  const { error } = await supabase.storage
    .from('images')
    .remove([imagePath])
  
  if (error) {
    console.error('Delete error:', error)
    throw new Error(`删除失败: ${error.message}`)
  }
  
  return { success: true }
}

export async function getUserImages(userId?: string) {
  const supabase = await createClient()
  
  // 获取当前用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("用户未登录")
  }
  
  // 如果没有指定 userId，则使用当前用户的 ID
  const targetUserId = userId || user.id
  
  // 用户只能查看自己的图片
  if (targetUserId !== user.id) {
    throw new Error("无权限查看其他用户的图片")
  }
  
  const { data, error } = await supabase.storage
    .from('images')
    .list(user.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })
  
  if (error) {
    console.error('List images error:', error)
    throw new Error(`获取图片列表失败: ${error.message}`)
  }
  
  // 为每个文件生成公开URL
  const imagesWithUrls = data.map(file => {
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`${user.id}/${file.name}`)
    
    return {
      ...file,
      url: publicUrl,
      path: `${user.id}/${file.name}`
    }
  })
  
  return imagesWithUrls
}
