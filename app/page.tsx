// pages/index.tsx
import ChatContainer from "@/components/ChatContainer"; // Adjust the import path as necessary

export default function Home() {
  return (
    <main className="flex h-[100vh] min-h-screen flex-col items-center justify-center bg-gray-100">
      <ChatContainer />
    </main>
  );
}
