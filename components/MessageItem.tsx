"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`py-2 px-4 my-2 rounded-md prose prose-sm max-w-none ${
        isUser
          ? "bg-blue-100 self-end prose-p:text-gray-800"
          : "bg-gray-100 self-start prose-p:text-gray-700"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Style links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          // Style code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={`${className} block bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto`}>
                {children}
              </code>
            );
          },
          // Style paragraphs
          p: ({ children }) => (
            <p className="my-1 leading-relaxed">{children}</p>
          ),
          // Style lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(MessageItem);
