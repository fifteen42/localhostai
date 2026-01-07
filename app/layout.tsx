import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalhostAI - Your AI Assistant for Chrome and Gemini Nano",
  description:
    "LocalhostAI: Your AI assistant designed to work seamlessly with Chrome and Gemini Nano. Enhance your productivity with advanced AI models running entirely on your device.",
  keywords: [
    "Gemini Nano",
    "Chrome AI",
    "AI assistant",
    "LocalhostAI",
    "on-device AI",
    "privacy-focused AI",
    "offline AI",
  ],
  authors: [{ name: "LocalhostAI" }],
  openGraph: {
    title: "LocalhostAI - Your AI Assistant for Chrome and Gemini Nano",
    description:
      "LocalhostAI: Your AI assistant designed to work seamlessly with Chrome and Gemini Nano. Enhance your productivity with advanced AI models running entirely on your device.",
    type: "website",
    url: "https://www.localhostai.xyz",
    siteName: "LocalhostAI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalhostAI - Your AI Assistant for Chrome and Gemini Nano",
    description:
      "Privacy-focused AI assistant running on Chrome's built-in Gemini Nano model.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
