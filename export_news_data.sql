-- Canton Mutual Financial 新闻数据导入脚本
-- 生成日期: 2026-01-26
-- 数据库类型: PostgreSQL

-- 注意：执行此脚本前请确保已经运行了数据库迁移（drizzle-kit migrate）

-- 插入示例新闻数据
INSERT INTO news (date, content, image1, image2, image3, image4, image5, image6, image7, image8, image9, created_at, updated_at)
VALUES
  (
    '2026-01-15',
    '誠港金融股份有限公司正式宣布成立，致力於為客戶提供高度定制化的金融服務和產品。作為一家註冊在香港、受SFC監管並持有1、4和9號牌照的精品投資銀行，我們將秉持"專業、潛力和合作夥伴"的核心理念，為客戶創造價值。',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
  ),
  (
    '2026-01-20',
    'Canton Mutual Financial Limited successfully completed its first strategic investment advisory project, helping a Hong Kong-based technology company secure Series A funding. This milestone demonstrates our commitment to supporting innovative enterprises in the Greater Bay Area.',
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
  ),
  (
    '2026-01-25',
    '誠港金融宣布與多家國際金融機構建立戰略合作關係，進一步擴大我們的全球服務網絡。這些合作將使我們能夠為客戶提供更全面的跨境金融解決方案，包括併購諮詢、資本市場服務和資產管理等領域。',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
  );

-- 查询插入的数据
SELECT * FROM news ORDER BY date DESC;

-- 使用说明：
-- 1. 连接到您的PostgreSQL数据库
-- 2. 选择canton_financial数据库
-- 3. 执行此脚本
--
-- 命令示例：
-- psql -h <RDS_ENDPOINT> -U <USERNAME> -d canton_financial -f export_news_data.sql
--
-- 或者在psql交互模式中：
-- \i /path/to/export_news_data.sql
