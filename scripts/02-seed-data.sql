-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('技术', 'tech', '技术相关文章', '#3b82f6'),
  ('生活', 'life', '生活感悟和随笔', '#10b981'),
  ('思考', 'thoughts', '个人思考和观点', '#8b5cf6'),
  ('教程', 'tutorials', '技术教程和指南', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('TypeScript', 'typescript'),
  ('CSS', 'css'),
  ('Node.js', 'nodejs'),
  ('数据库', 'database'),
  ('前端', 'frontend'),
  ('后端', 'backend'),
  ('全栈', 'fullstack')
ON CONFLICT (slug) DO NOTHING;
