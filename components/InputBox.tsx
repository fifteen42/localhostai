import { useState } from "react";

interface InputBoxProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function InputBox({ onSend, loading }: InputBoxProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex w-full sm:w-3/5 items-center mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleSend}
        className={`ml-2 px-4 py-2 rounded-md text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Send
      </button>
    </div>
  );
}
