/**
 * Chrome Built-in AI Prompt API Types
 * Based on the latest Chrome AI APIs (2025)
 * @see https://developer.chrome.com/docs/ai/built-in
 */

// AI Language Model Types
interface AILanguageModelCapabilities {
  available: "no" | "after-download" | "readily";
  defaultTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
}

interface AILanguageModelCreateOptions {
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
  systemPrompt?: string;
  initialPrompts?: AILanguageModelPrompt[];
}

interface AILanguageModelPrompt {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AILanguageModelPromptOptions {
  signal?: AbortSignal;
}

interface AILanguageModel {
  prompt(
    input: string,
    options?: AILanguageModelPromptOptions
  ): Promise<string>;
  promptStreaming(
    input: string,
    options?: AILanguageModelPromptOptions
  ): ReadableStream<string>;
  countPromptTokens(input: string): Promise<number>;
  clone(): Promise<AILanguageModel>;
  destroy(): void;
  readonly maxTokens: number;
  readonly tokensSoFar: number;
  readonly tokensLeft: number;
  readonly topK: number;
  readonly temperature: number;
}

interface AILanguageModelFactory {
  capabilities(): Promise<AILanguageModelCapabilities>;
  create(options?: AILanguageModelCreateOptions): Promise<AILanguageModel>;
}

// Main AI interface
interface AI {
  languageModel: AILanguageModelFactory;
  // Legacy APIs (deprecated but still supported)
  canCreateTextSession?: () => Promise<string>;
  createTextSession?: () => Promise<AILanguageModel>;
  canCreateGenericSession?: () => Promise<string>;
  createGenericSession?: () => Promise<AILanguageModel>;
}

// Extend Window interface
interface Window {
  ai?: AI;
}

// Message type for the chat
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}
