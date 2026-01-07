"use client";

import { useCallback, useEffect, useState, useId } from "react";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import { AntDesignClearOutlined } from "./DeleteIcon";

// Generate unique ID for messages
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages) as Message[];
        // Migrate old messages without ID
        const migratedMessages = parsedMessages.map((msg) => ({
          ...msg,
          id: msg.id || generateId(),
          timestamp: msg.timestamp || Date.now(),
        }));
        setMessages(migratedMessages);
      }
    } catch (error) {
      console.error("Failed to parse messages from localStorage:", error);
      localStorage.removeItem("messages");
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("messages", JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages to localStorage:", error);
      }
    }
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    if (loading) return;

    const userMessage: Message = {
      id: generateId(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    const loadingMessageId = generateId();
    const loadingMessage: Message = {
      id: loadingMessageId,
      sender: "bot",
      text: "...",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setLoading(true);

    try {
      // Check for the new Prompt API first, then fall back to legacy
      if (!window.ai) {
        throw new Error("Gemini Nano not ready or not supported.");
      }

      let session: AILanguageModel;

      // Try new API first
      if (window.ai.languageModel) {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available !== "readily") {
          throw new Error("Gemini Nano not ready or not supported.");
        }
        session = await window.ai.languageModel.create();
      }
      // Fall back to legacy API
      else if (window.ai.canCreateTextSession) {
        const available = await window.ai.canCreateTextSession();
        if (available !== "readily") {
          throw new Error("Gemini Nano not ready or not supported.");
        }
        session = await window.ai.createTextSession!();
      } else {
        throw new Error("Gemini Nano not ready or not supported.");
      }

      // Use streaming for better UX
      const stream = session.promptStreaming(text);
      let fullResponse = "";

      // Handle the ReadableStream properly
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Accumulate the response chunks
          fullResponse = value; // Chrome AI returns cumulative text, not chunks

          // Update message in real-time
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessageId
                ? { ...msg, text: fullResponse }
                : msg
            )
          );
        }
      } finally {
        reader.releaseLock();
      }

      // Ensure final message is set
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: fullResponse || "No response received." }
            : msg
        )
      );

      session.destroy();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      let responseText = `Error: ${errorMessage}`;

      if (errorMessage === "Gemini Nano not ready or not supported.") {
        responseText = `**Error:** ${errorMessage}

To enable Chrome's built-in on-device model, follow these steps:

1. Download the latest version of [**Chrome Dev**](https://google.com/chrome/dev/) or [**Chrome Canary**](https://google.com/chrome/canary/).

2. Open: \`chrome://flags/#optimization-guide-on-device-model\` and select **Enabled BypassPerfRequirement**.

3. Open: \`chrome://flags/#prompt-api-for-gemini-nano\` and select **Enabled**.

4. Restart Chrome and wait for the model to download. Check status at \`chrome://components/\` under **Optimization Guide On Device Model**.

Once complete, return to [**www.localhostai.xyz**](http://www.localhostai.xyz) and say **hello**!`;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: responseText }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("messages");
  }, []);

  return (
    <div className="flex h-4/5 flex-col bg-white shadow-md rounded-md w-4/5">
      <header className="flex items-center justify-between p-4 border-b border-gray-300">
        <h1 className="text-lg font-semibold sm:text-base md:text-lg">
          <span className="sm:hidden inline text-sm">
            Chat with Gemini Nano
          </span>
          <span className="hidden sm:inline">
            Chat With Your Chrome AI Model
          </span>
        </h1>
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-gray-500">
            {messages.length} messages
          </span>
          <button
            onClick={clearMessages}
            className="text-black p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Clear messages"
          >
            <AntDesignClearOutlined />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      <div className="p-4 flex items-center justify-center">
        <InputBox onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
