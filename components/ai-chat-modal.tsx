"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChat } from "./chat-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const AIChatModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { messages, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    addMessage({ role: "user", content: userMessage });
    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        responseText += chunk;
        setCurrentResponse(responseText);
      }

      addMessage({ role: "assistant", content: responseText });
      setCurrentResponse("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-2">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] overflow-y-auto mb-4 flex flex-col-reverse">
          <div ref={messagesEndRef} />
          {isLoading && !currentResponse && (
            <div className="text-center">
              <div className="animate-pulse">생각중...</div>
            </div>
          )}
          {isLoading && currentResponse && (
            <div className="mb-4 p-4 rounded-lg bg-gray-50 max-w-[80%]">
              {renderMessage(currentResponse)}
            </div>
          )}
          {[...messages].reverse().map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-50 ml-auto max-w-[80%]"
                  : "bg-gray-50 max-w-[80%]"
              }`}
            >
              {renderMessage(message.content)}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 