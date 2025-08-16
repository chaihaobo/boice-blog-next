"use client"

import MDEditor from '@uiw/react-md-editor'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div data-color-mode="light">
        <MDEditor.Markdown source={content} />
      </div>
    </div>
  )
}
