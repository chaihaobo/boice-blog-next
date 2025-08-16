# Boice Blog System

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/boices-projects/v0-boice-blog-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/cNmYbOUGBeE)

## Overview

基于Next.js的博客系统，支持Markdown编辑器和图片上传功能。

### 功能特性

- 基于Next.js 14的现代博客系统
- Markdown富文本编辑器
- 图片上传和粘贴功能
- 文章分类和标签管理
- 评论系统
- 响应式设计

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/boices-projects/v0-boice-blog-system](https://vercel.com/boices-projects/v0-boice-blog-system)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/cNmYbOUGBeE](https://v0.app/chat/projects/cNmYbOUGBeE)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 图片上传功能配置

本项目使用Supabase Storage存储上传的图片。请按照以下步骤配置：

1. 登录Supabase控制台
2. 创建一个名为`blog-images`的存储桶
3. 设置存储桶权限：
   - 对于匿名用户：仅允许读取（用于公开访问图片）
   - 对于已认证用户：允许读取和写入（用于上传图片）

### 存储桶策略配置

在Supabase控制台中，为`blog-images`存储桶添加以下策略：

```sql
-- 允许已认证用户上传图片
CREATE POLICY "允许已认证用户上传图片" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND path LIKE 'post-images/%');

-- 允许所有人查看图片
CREATE POLICY "允许所有人查看图片" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');
```

## 使用方法

### 图片上传

在文章编辑器中，您可以通过以下方式上传图片：

1. 点击「上传图片」按钮选择图片文件
2. 将图片文件拖放到上传区域
3. 从其他应用复制图片，然后在编辑器中粘贴（Ctrl+V 或 Cmd+V）

上传成功后，图片将自动插入到编辑器的当前光标位置。
