-- 创建系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入关于我的基础设置数据
INSERT INTO system_settings (key, value, description) VALUES
('about_title', '关于我', '关于页面标题'),
('about_intro', '全栈工程师，主力语言 Go，精通 Java 与 Next.js/React 前端技术。擅长微服务架构、高并发系统设计，具备端到端开发与DevOps平台建设能力，能够独立完成全栈项目并推动团队高效交付。', '个人简介'),
('about_email', 'datachaihaobo@gmail.com', '联系邮箱'),
('about_skills', 'Go,Java,Next.js,React,微服务架构,高并发系统设计,DevOps,全栈开发', '技能列表，逗号分隔'),
('about_experience', '具备8年丰富的全栈开发经验，专注于高性能系统架构设计与实现', '工作经验描述'),
('about_contact_welcome', '欢迎联系我进行技术交流与合作', '联系欢迎语')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 启用行级安全策略
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有人可以读取
CREATE POLICY "Allow public read access" ON system_settings
    FOR SELECT USING (true);