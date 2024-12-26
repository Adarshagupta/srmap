"use client";

import { useRouter } from 'next/navigation';

export function RenderContent({ content }: { content: string }) {
  const router = useRouter();
  const parts = content.split(/(#[\w\u0590-\u05ff]+)/g);

  const handleHashtagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    const cleanTag = tag.slice(1).toLowerCase(); // Remove # and convert to lowercase
    router.push(`/hashtag/${cleanTag}`);
  };

  return (
    <span className="break-words">
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <button
              key={index}
              onClick={(e) => handleHashtagClick(e, part)}
              className="text-primary hover:underline font-medium inline-block"
            >
              {part}
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
} 