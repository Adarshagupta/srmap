import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface LessonContentProps {
  content: string;
  className?: string;
}

export function LessonContent({ content, className }: LessonContentProps) {
  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';
            
            if (inline) {
              return (
                <code className="px-1 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="relative group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigator.clipboard.writeText(String(children))}
                    className="text-xs text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    padding: '1rem',
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700 dark:text-slate-300">{children}</li>
          ),
          a: ({ children, href }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 