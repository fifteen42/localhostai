import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocalhostAI - Your AI Assistant for Chrome and Gemini Nano",
  description:
    "LocalhostAI: Your AI assistant designed to work seamlessly with Chrome and Gemini Nano. Enhance your productivity with advanced AI models.",
  keywords: ["model", "chrome", "Gemini Nano", "AI assistant", "LocalhostAI"],
  openGraph: {
    title: "LocalhostAI - Your AI Assistant for Chrome and Gemini Nano",
    description:
      "LocalhostAI: Your AI assistant designed to work seamlessly with Chrome and Gemini Nano. Enhance your productivity with advanced AI models.",
    type: "website",
    url: "https://www.localhostai.xyz",
    siteName: "LocalhostAI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
