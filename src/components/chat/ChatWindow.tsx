"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Company {
  id: string;
  name: string;
  primary_color: string;
  chatbot_tone: string;
  chatbot_greeting: string;
  show_pricing: boolean;
  require_email: boolean;
  website: string;
  industries: { name: string } | null;
}

interface Service {
  id: string;
  name: string;
  price_min: number;
  price_max: number;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ChatWindow({
  company,
  services,
  faqs,
  qrCodeId,
}: {
  company: Company;
  services: Service[];
  faqs: FAQ[];
  qrCodeId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const industryName = company.industries?.name?.toLowerCase() || "our services";
    const greeting =
      company.chatbot_greeting ||
      `Hey! 👋 I'm the assistant for ${company.name}. Looking for ${industryName}? I can help you get a quote in about 60 seconds!\n\nWhat service do you need?`;

    setMessages([{ role: "assistant", content: greeting }]);
  }, [company]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          companyId: company.id,
          qrCodeId,
          sessionId,
          services,
          faqs,
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }

      // If lead was captured, show success and redirect
      if (data.leadCaptured && company.website) {
        setTimeout(() => {
          window.location.href = company.website;
        }, 3000);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had a hiccup. Could you try that again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-md h-[600px] overflow-hidden">
      {/* Chat Header */}
      <div
        className="p-4 text-white text-center"
        style={{ backgroundColor: company.primary_color || "#FF6B00" }}
      >
        <h2 className="font-semibold">Chat with {company.name}</h2>
        <p className="text-sm opacity-80">Usually replies instantly</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap ${
                msg.role === "user"
                  ? "rounded-br-sm text-white"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
              }`}
              style={
                msg.role === "user"
                  ? { backgroundColor: company.primary_color || "#FF6B00" }
                  : {}
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ 
              // @ts-expect-error CSS custom property
              "--tw-ring-color": company.primary_color || "#FF6B00" 
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="text-white px-5 py-3 rounded-full font-medium disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: company.primary_color || "#FF6B00" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
