"use client";

import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from "react";

interface InputBoxProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function InputBox({ onSend, loading }: InputBoxProps) {
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed && !loading) {
      onSend(trimmed);
      setInput("");
    }
  }, [input, loading, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <div className="flex w-full sm:w-3/5 items-center mt-4 gap-2">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={loading}
        aria-label="Message input"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        aria-label="Send message"
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          loading || !input.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        }`}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
