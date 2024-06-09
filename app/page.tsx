// pages/index.tsx
import ChatContainer from "@/components/ChatContainer"; // Adjust the import path as necessary
import GitHubIcon from "@/components/GitHubIcon";

export default function Home() {
  return (
    <main className="flex h-[100vh] min-h-screen flex-col items-center justify-center bg-gray-100">
      <a
        href="https://github.com/fifteen42/localhostai"
        className="absolute top-4 right-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon />
      </a>
      <ChatContainer />
    </main>
  );
}
