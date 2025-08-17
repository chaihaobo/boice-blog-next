# Boice Blog Next

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/boices-projects/v0-boice-blog-system)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

一个基于 Next.js 15 构建的现代化全栈博客系统，支持国际化、主题切换、评论系统等丰富功能。

## ✨ 功能特性

### 🎨 用户界面
- **现代化设计**：基于 Tailwind CSS 和 Radix UI 组件库
- **响应式布局**：完美适配桌面端和移动端
- **主题切换**：支持明暗主题自动切换
- **国际化支持**：中英文双语界面

### 📝 内容管理
- **Markdown 编辑器**：支持实时预览的富文本编辑
- **图片上传**：支持拖拽、粘贴和文件选择上传
- **文章分类**：灵活的分类和标签系统
- **草稿保存**：支持草稿、发布、归档状态管理

### 💬 互动功能
- **评论系统**：支持嵌套回复的评论功能
- **用户认证**：基于 Supabase Auth 的安全认证
- **用户资料**：个人资料管理和头像上传

### 🔧 管理功能
- **仪表板**：文章统计和快速操作面板
- **评论管理**：评论审核和管理功能
- **系统设置**：灵活的系统配置选项

## 🛠️ 技术栈

### 前端技术
- **Next.js 15**：React 全栈框架，支持 App Router
- **React 19**：最新的 React 版本
- **TypeScript**：类型安全的 JavaScript
- **Tailwind CSS**：实用优先的 CSS 框架
- **Radix UI**：无障碍的组件库
- **Geist Font**：现代化的字体系统

### 后端服务
- **Supabase**：开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 实时订阅
  - 用户认证
  - 文件存储
- **Server Actions**：Next.js 服务端操作

### 开发工具
- **ESLint**：代码质量检查
- **PostCSS**：CSS 处理工具
- **Vercel Analytics**：网站分析

## 🚀 快速开始

### 环境要求
- Node.js 18.17 或更高版本
- npm、yarn 或 pnpm 包管理器

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env.local
```

2. 配置 Supabase 环境变量：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 数据库设置

1. 在 Supabase 控制台中运行 `scripts/` 目录下的 SQL 脚本：
   - `01-create-tables.sql` - 创建数据表
   - `02-seed-data.sql` - 初始化数据
   - `03-add-indexes-and-triggers.sql` - 添加索引和触发器
   - `04-add-foreign-keys.sql` - 添加外键约束
   - `05-setup-storage.sql` - 设置文件存储
   - `06-create-settings-table.sql` - 创建设置表
   - `07-seed-posts.sql` - 添加示例文章

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
boice-blog-next/
├── app/                    # Next.js App Router 页面
│   ├── about/             # 关于页面
│   ├── api/               # API 路由
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 仪表板页面
│   ├── posts/             # 文章页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── auth/              # 认证相关组件
│   ├── comments/          # 评论系统组件
│   ├── dashboard/         # 仪表板组件
│   ├── posts/             # 文章相关组件
│   └── ui/                # 基础 UI 组件
├── lib/                   # 工具库和配置
│   ├── i18n/              # 国际化配置
│   ├── supabase/          # Supabase 客户端
│   ├── actions.ts         # Server Actions
│   └── types.ts           # TypeScript 类型定义
├── public/                # 静态资源
├── scripts/               # 数据库脚本
└── styles/                # 全局样式
```

## 🖼️ 图片上传配置

本项目使用 Supabase Storage 存储上传的图片。请按照以下步骤配置：

### 1. 创建存储桶

在 Supabase 控制台中：
1. 进入 Storage 页面
2. 创建一个名为 `blog-images` 的存储桶
3. 设置为公开访问（Public bucket）

### 2. 配置存储策略

在 Supabase SQL 编辑器中运行以下策略：

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

-- 允许已认证用户删除自己上传的图片
CREATE POLICY "允许已认证用户删除图片" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
```

### 3. 图片上传使用方法

在文章编辑器中，支持多种图片上传方式：

- **文件选择**：点击「上传图片」按钮选择本地图片
- **拖拽上传**：直接将图片文件拖放到编辑器区域
- **粘贴上传**：复制图片后使用 `Ctrl+V` (Windows) 或 `Cmd+V` (Mac) 粘贴

支持的图片格式：JPG、PNG、GIF、WebP

## 🌐 部署

### Vercel 部署（推荐）

1. Fork 本仓库到你的 GitHub 账户
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. 部署完成

### 其他平台部署

本项目支持部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 组件使用 PascalCase 命名
- 文件和目录使用 kebab-case 命名

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复问题
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Supabase](https://supabase.com/) - 开源后端服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 组件库
- [Vercel](https://vercel.com/) - 部署平台

## 📞 联系

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/boice-blog-next/issues)
- 发送邮件：your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
