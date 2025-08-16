import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 获取当前用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }
    
    // 获取表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只允许上传图片文件' }, { status: 400 })
    }
    
    // 验证文件大小（限制为 5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 5MB' }, { status: 400 })
    }
    
    // 生成唯一文件名
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    
    // 上传到用户专属文件夹：用户ID/文件名
    const filePath = `${user.id}/${fileName}`
    
    // 将文件转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)
    
    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      })
    
    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json({ error: `上传失败: ${error.message}` }, { status: 500 })
    }
    
    // 获取公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path)
    
    return NextResponse.json({ 
      url: publicUrl,
      path: data.path,
      user_id: user.id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 获取用户的图片列表
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 获取当前用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }
    
    // 获取用户的图片列表
    const { data, error } = await supabase.storage
      .from('blog-images')
      .list(user.id, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (error) {
      console.error('List images error:', error)
      return NextResponse.json({ error: `获取图片列表失败: ${error.message}` }, { status: 500 })
    }
    
    // 为每个文件生成公开URL
    const imagesWithUrls = data.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`${user.id}/${file.name}`)
      
      return {
        ...file,
        url: publicUrl,
        path: `${user.id}/${file.name}`
      }
    })
    
    return NextResponse.json({ images: imagesWithUrls })
  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 删除图片
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 获取当前用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }
    
    // 从查询参数获取图片路径
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')
    
    if (!imagePath) {
      return NextResponse.json({ error: '未提供图片路径' }, { status: 400 })
    }
    
    // 验证用户只能删除自己的文件
    if (!imagePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: '无权限删除此文件' }, { status: 403 })
    }
    
    // 删除文件
    const { error } = await supabase.storage
      .from('images')
      .remove([imagePath])
    
    if (error) {
      console.error('Delete image error:', error)
      return NextResponse.json({ error: `删除失败: ${error.message}` }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}