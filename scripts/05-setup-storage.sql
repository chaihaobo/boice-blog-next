-- 创建存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 删除已存在的策略（如果有的话）
DROP POLICY IF EXISTS "用户可以上传到自己的文件夹" ON storage.objects;
DROP POLICY IF EXISTS "用户可以查看自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "用户可以删除自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "用户可以更新自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "允许查看公开文件" ON storage.objects;
DROP POLICY IF EXISTS "Images upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Images select policy" ON storage.objects;
DROP POLICY IF EXISTS "Images delete policy" ON storage.objects;
DROP POLICY IF EXISTS "Images update policy" ON storage.objects;

-- 创建 Storage RLS 策略

-- 1. 允许用户上传到自己的文件夹
-- 文件路径格式：用户ID/文件名
CREATE POLICY "Images upload policy" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'images' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- 2. 允许用户查看自己的文件
CREATE POLICY "Images select policy" ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'images' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- 3. 允许用户删除自己的文件
CREATE POLICY "Images delete policy" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'images' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- 4. 允许用户更新自己的文件
CREATE POLICY "Images update policy" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'images' 
  AND auth.uid()::text = split_part(name, '/', 1)
)
WITH CHECK (
  bucket_id = 'images' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- 启用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 注意：这些策略确保：
-- 1. 用户只能上传文件到以自己用户ID命名的文件夹中
-- 2. 用户只能查看、删除和更新自己文件夹中的文件
-- 3. 文件路径必须是：用户ID/文件名 的格式
