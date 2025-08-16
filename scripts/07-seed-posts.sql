-- 插入示例文章数据
-- 注意：这里使用的author_id需要替换为实际的用户ID

-- 首先获取一些基础数据的ID
-- 假设已经有用户注册，这里使用占位符，实际使用时需要替换为真实的用户ID

-- 插入示例文章（需要先有用户注册后获取真实的user ID）
-- 以下是示例SQL，实际执行时需要替换author_id为真实的用户ID

/*
-- 示例：插入文章数据
-- 请将 'YOUR_USER_ID_HERE' 替换为实际的用户ID

INSERT INTO posts (title, slug, content, excerpt, status, author_id, category_id, published_at) 
SELECT 
  '我的第一篇技术博客',
  'my-first-tech-blog',
  '# 欢迎来到我的技术博客\n\n这是我的第一篇技术博客文章。在这里，我将分享我在软件开发过程中的经验和见解。\n\n## 关于这个博客\n\n这个博客使用Next.js和Supabase构建，具有以下特性：\n\n- 现代化的UI设计\n- 响应式布局\n- 用户认证系统\n- 文章管理功能\n- 评论系统\n\n## 技术栈\n\n- **前端**: Next.js 14, React, TypeScript\n- **后端**: Supabase\n- **样式**: Tailwind CSS\n- **部署**: Vercel\n\n希望你喜欢这个博客！',
  '欢迎来到我的技术博客！这是我的第一篇文章，介绍了这个博客的技术栈和特性。',
  'published',
  'YOUR_USER_ID_HERE',
  (SELECT id FROM categories WHERE slug = 'tech' LIMIT 1),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'my-first-tech-blog');

INSERT INTO posts (title, slug, content, excerpt, status, author_id, category_id, published_at)
SELECT 
  'Next.js 14 新特性详解',
  'nextjs-14-new-features',
  '# Next.js 14 新特性详解\n\nNext.js 14 带来了许多令人兴奋的新特性和改进。让我们一起来看看这些更新。\n\n## App Router 稳定版\n\nApp Router 现在已经稳定，提供了更好的性能和开发体验：\n\n- 服务器组件\n- 流式渲染\n- 并行路由\n- 拦截路由\n\n## Turbopack\n\n新的打包工具 Turbopack 提供了：\n\n- 更快的开发服务器启动\n- 增量编译\n- 更好的热重载\n\n## 服务器操作\n\n服务器操作让表单处理变得更简单：\n\n```typescript\nasync function createPost(formData: FormData) {\n  "use server"\n  // 处理表单数据\n}\n```\n\n这些新特性让Next.js成为了构建现代Web应用的最佳选择之一。',
  'Next.js 14 带来了App Router稳定版、Turbopack和服务器操作等新特性，让开发体验更加出色。',
  'published',
  'YOUR_USER_ID_HERE',
  (SELECT id FROM categories WHERE slug = 'tech' LIMIT 1),
  NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'nextjs-14-new-features');

INSERT INTO posts (title, slug, content, excerpt, status, author_id, category_id, published_at)
SELECT 
  '全栈开发的思考',
  'fullstack-development-thoughts',
  '# 全栈开发的思考\n\n作为一名全栈开发者，我想分享一些关于全栈开发的思考和经验。\n\n## 什么是全栈开发\n\n全栈开发不仅仅是掌握前端和后端技术，更重要的是：\n\n- 理解整个应用的架构\n- 能够在不同层面之间切换思维\n- 具备解决复杂问题的能力\n\n## 技能要求\n\n### 前端技能\n- HTML/CSS/JavaScript\n- 现代框架（React, Vue, Angular）\n- 状态管理\n- 构建工具\n\n### 后端技能\n- 服务器端语言（Node.js, Python, Java, Go）\n- 数据库设计\n- API设计\n- 安全性\n\n### DevOps技能\n- 版本控制\n- CI/CD\n- 云服务\n- 监控和日志\n\n## 持续学习\n\n技术发展很快，全栈开发者需要保持学习的心态，关注新技术的发展。',
  '分享作为全栈开发者的思考和经验，包括技能要求和持续学习的重要性。',
  'published',
  'YOUR_USER_ID_HERE',
  (SELECT id FROM categories WHERE slug = 'thoughts' LIMIT 1),
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'fullstack-development-thoughts');

INSERT INTO posts (title, slug, content, excerpt, status, author_id, category_id, published_at)
SELECT 
  '生活中的编程思维',
  'programming-mindset-in-life',
  '# 生活中的编程思维\n\n编程不仅仅是工作，它也是一种思维方式，可以应用到生活的各个方面。\n\n## 分解问题\n\n就像编程中我们会把复杂的问题分解成小的函数一样，生活中的大目标也可以分解成小的可执行步骤。\n\n## 调试思维\n\n当生活中遇到问题时，我们可以像调试代码一样：\n\n1. 识别问题\n2. 分析原因\n3. 制定解决方案\n4. 测试和验证\n5. 持续改进\n\n## 版本控制\n\n生活也需要"版本控制"：\n- 记录重要的决定和变化\n- 从错误中学习\n- 保持成长的轨迹\n\n## 重构生活\n\n定期审视和优化我们的生活方式，就像重构代码一样，让生活变得更高效、更有意义。\n\n编程思维让我们更有条理地面对生活中的挑战。',
  '探讨如何将编程思维应用到日常生活中，包括问题分解、调试思维和持续改进。',
  'published',
  'YOUR_USER_ID_HERE',
  (SELECT id FROM categories WHERE slug = 'life' LIMIT 1),
  NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'programming-mindset-in-life');

INSERT INTO posts (title, slug, content, excerpt, status, author_id, category_id, published_at)
SELECT 
  'React Hooks 最佳实践',
  'react-hooks-best-practices',
  '# React Hooks 最佳实践\n\nReact Hooks 改变了我们编写React组件的方式。以下是一些最佳实践。\n\n## useState 最佳实践\n\n### 1. 合理拆分状态\n\n```typescript\n// 不好的做法\nconst [user, setUser] = useState({\n  name: "",\n  email: "",\n  preferences: {}\n});\n\n// 更好的做法\nconst [name, setName] = useState("");\nconst [email, setEmail] = useState("");\nconst [preferences, setPreferences] = useState({});\n```\n\n### 2. 使用函数式更新\n\n```typescript\n// 当新状态依赖于旧状态时\nsetCount(prevCount => prevCount + 1);\n```\n\n## useEffect 最佳实践\n\n### 1. 正确设置依赖数组\n\n```typescript\nuseEffect(() => {\n  fetchUserData(userId);\n}, [userId]); // 包含所有依赖\n```\n\n### 2. 清理副作用\n\n```typescript\nuseEffect(() => {\n  const timer = setInterval(() => {\n    // 定时器逻辑\n  }, 1000);\n\n  return () => clearInterval(timer);\n}, []);\n```\n\n## 自定义Hooks\n\n将复杂的逻辑提取到自定义Hooks中：\n\n```typescript\nfunction useLocalStorage(key: string, initialValue: any) {\n  const [value, setValue] = useState(() => {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : initialValue;\n  });\n\n  const setStoredValue = (value: any) => {\n    setValue(value);\n    localStorage.setItem(key, JSON.stringify(value));\n  };\n\n  return [value, setStoredValue];\n}\n```\n\n遵循这些最佳实践，可以让你的React代码更加健壮和可维护。',
  'React Hooks的最佳实践指南，包括useState、useEffect和自定义Hooks的正确使用方法。',
  'published',
  'YOUR_USER_ID_HERE',
  (SELECT id FROM categories WHERE slug = 'tutorials' LIMIT 1),
  NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'react-hooks-best-practices');
*/

-- 使用说明：
-- 1. 首先需要有用户注册并登录
-- 2. 获取用户的ID（可以在Supabase控制台的auth.users表中查看）
-- 3. 将上面注释中的 'YOUR_USER_ID_HERE' 替换为实际的用户ID
-- 4. 取消注释并执行SQL语句

-- 或者，如果你想快速测试，可以先创建一个测试用户：
-- 注意：这只是为了测试，实际应用中用户应该通过注册流程创建

-- 检查是否已有用户，如果没有则提示需要先注册用户
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
        RAISE NOTICE '没有找到用户，请先注册一个用户账号，然后使用该用户ID替换示例SQL中的 YOUR_USER_ID_HERE';
    ELSE
        RAISE NOTICE '找到用户，请复制上面注释中的SQL语句，将 YOUR_USER_ID_HERE 替换为实际用户ID后执行';
    END IF;
END $$;