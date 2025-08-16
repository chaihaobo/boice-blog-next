-- Add foreign key constraints for proper table relationships

-- Add foreign key from posts to profiles (author relationship)
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key from posts to categories
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add foreign key from comments to posts
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_post 
FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Add foreign key from comments to profiles (author relationship)
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key from comments to comments (parent relationship for replies)
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_parent 
FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

-- Add foreign key from post_tags to posts
ALTER TABLE post_tags 
ADD CONSTRAINT fk_post_tags_post 
FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Add foreign key from post_tags to tags
ALTER TABLE post_tags 
ADD CONSTRAINT fk_post_tags_tag 
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

-- Add composite primary key for post_tags junction table
ALTER TABLE post_tags 
ADD CONSTRAINT pk_post_tags 
PRIMARY KEY (post_id, tag_id);
