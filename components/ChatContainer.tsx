"use client";
import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import { AntDesignClearOutlined } from "./DeleteIcon";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to load messages from localStorage
  const loadMessages = () => {
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        console.log("Messages loaded from localStorage:", parsedMessages);
      } catch (error) {
        console.error("Failed to parse messages from localStorage:", error);
      }
    } else {
      console.log("No messages found in localStorage.");
    }
  };

  // Function to save messages to localStorage
  const saveMessages = (messages: Message[]) => {
    try {
      localStorage.setItem("messages", JSON.stringify(messages));
      console.log("Messages saved to localStorage:", messages);
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  };

  // Load messages when the component mounts
  useEffect(() => {
    loadMessages();
  }, []); // Empty dependency array means this effect runs once on mount

  // Save messages whenever they change
  useEffect(() => {
    // Avoid initial empty array save
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (loading) return;
    const userMessage: Message = { sender: "user", text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true);
    const loadingMessage: Message = { sender: "bot", text: "..." };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    try {
      if (
        !window ||
        !window.ai ||
        (await window.ai.canCreateTextSession()) !== "readily"
      ) {
        throw new Error("Gemini Nano not ready or not supported.");
      }

      const session = await window.ai.createTextSession();
      const stream = session.promptStreaming(text);
      let aiMessage = "";

      for await (const chunk of stream) {
        aiMessage = chunk;
      }

      // Remove the loading message and add the actual bot message
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { sender: "bot", text: aiMessage },
      ]);

      session.destroy();
    } catch (error: any) {
      console.error(error);

      let errorMessage: Message = {
        sender: "bot",
        text: "Error: " + error.message,
      };
      if (error.message === "Gemini Nano not ready or not supported.") {
        errorMessage = {
          sender: "bot",
          text: `**Error:** ${error.message}\n\nTo enable Chrome's built-in on-device model, follow these steps:\n\n 1- Download the latest version of [**Chrome Dev**](https://google.com/chrome/dev/).\n\n 2- Open: [chrome://flags/#optimization-guide-on-device-model](chrome://flags/#optimization-guide-on-device-model) and select **Enabled BypassPerfRequirement**.\n\n 3- Open: [chrome://flags/#prompt-api-for-gemini-nano](chrome://flags/#prompt-api-for-gemini-nano) and select **Enabled**.\n\n 4- Wait for the model to download. You can check the download status at [chrome://components/](chrome://components/) under **Optimization Guide On Device Model**.\n\nOnce these steps are completed, you can use the on-device model in Chrome Dev. After the download is complete, please return to [**www.localhostai.xyz**](http://www.localhostai.xyz) and say **hello** to me!`,
        };
      }
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
    console.log("All messages cleared.");
  };

  return (
    <div className="flex h-4/5 flex-col bg-white shadow-md rounded-md w-4/5">
      <header className="flex items-center justify-between p-4 border-b border-gray-300">
        <h1 className="text-lg font-semibold">
          Chat With Your Chrome AI Model
        </h1>
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-gray-500">
            {messages.length} messages
          </span>
          <button
            onClick={clearMessages}
            className=" text-black p-2 hover:bg-gray-100 rounded"
          >
            <AntDesignClearOutlined />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      <div className="p-4 flex items-center justify-center ">
        <InputBox onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
