"use client";

import { useEffect, useState } from "react";

interface Message {
  type: "bot" | "user";
  content: string;
  options?: string[];
}

const conversation: Message[] = [
  {
    type: "bot",
    content:
      "Hey! I'm the assistant for Pro Carpet Care. Looking for carpet cleaning? I can help you get a quote in about 60 seconds.",
  },
  {
    type: "bot",
    content: "What kind of service are you looking for?",
    options: ["Carpet Cleaning", "Pet Stain Treatment", "Tile & Grout"],
  },
  {
    type: "user",
    content: "Carpet Cleaning",
  },
  {
    type: "bot",
    content: "How many rooms do you need cleaned?",
  },
  {
    type: "user",
    content: "3 rooms and a hallway",
  },
  {
    type: "bot",
    content: "Got it! When do you need this done?",
    options: ["This week (urgent)", "Within 2 weeks", "Just getting quotes"],
  },
  {
    type: "user",
    content: "Within 2 weeks",
  },
  {
    type: "bot",
    content:
      "For 3 rooms and a hallway, you're typically looking at $150-200. What's the best phone number to reach you?",
  },
  {
    type: "user",
    content: "719-555-1234",
  },
  {
    type: "bot",
    content: "And your name?",
  },
  {
    type: "user",
    content: "Mike",
  },
  {
    type: "bot",
    content:
      "Thanks Mike! Someone from Pro Carpet Care will call you within a few hours to confirm your appointment.",
  },
];

export default function ChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    if (visibleMessages < conversation.length) {
      const timer = setTimeout(
        () => {
          setVisibleMessages((v) => v + 1);
        },
        visibleMessages === 0 ? 500 : 1200
      );
      return () => clearTimeout(timer);
    } else {
      // Reset after showing all messages
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0);
      }, 4000);
      return () => clearTimeout(resetTimer);
    }
  }, [visibleMessages, isAnimating]);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-neutral-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-neutral-900 rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="bg-neutral-800 rounded-[2.5rem] overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-4 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">PC</span>
              </div>
              <div>
                <h3 className="font-semibold">Pro Carpet Care</h3>
                <p className="text-xs text-white/80">Usually replies instantly</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-neutral-850" style={{ backgroundColor: '#1a1a2e' }}>
            {conversation.slice(0, visibleMessages).map((message, i) => (
              <div
                key={i}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={
                    message.type === "bot" ? "chat-bubble-bot" : "chat-bubble-user"
                  }
                >
                  <p className="text-sm">{message.content}</p>
                  {message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, j) => (
                        <div
                          key={j}
                          className="bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {visibleMessages < conversation.length &&
              visibleMessages > 0 &&
              conversation[visibleMessages]?.type === "bot" && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-700 p-3 flex gap-2 bg-neutral-800">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-neutral-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none placeholder-neutral-400"
              disabled
            />
            <button className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
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
    </div>
  );
}
