// components/MessageItem.tsx

import { marked } from "marked";
import DOMPurify from "dompurify";
import React from "react";

interface MessageItemProps {
  message: {
    sender: "user" | "bot";
    text: string;
  };
}

export default function MessageItem({ message }: MessageItemProps) {
  const text = typeof message.text === "string" ? message.text : "";
  // Convert Markdown to HTML and sanitize it
  const htmlContent = DOMPurify.sanitize(marked(text) as string);

  return (
    <div
      className={`py-2 px-4 my-2 rounded-md ${
        message.sender === "user"
          ? "bg-blue-100 self-end"
          : "bg-gray-100 self-start"
      }`}
      // Use dangerouslySetInnerHTML to render HTML content
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
