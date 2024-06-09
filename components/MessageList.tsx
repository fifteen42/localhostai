// components/MessageList.tsx
import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: {
    sender: "user" | "bot";
    text: string;
  }[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-2 overflow-auto max-h-[80vh]">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
