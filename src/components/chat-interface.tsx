import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatInterface = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello, how can I help you today?",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      role: "user",
      content: "I have a question about the product",
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleSubmit = () => {
    setMessages([
      ...messages,
      { id: messages.length + 1, role: "user", content: message, createdAt: new Date().toISOString() },
    ]);
    setMessage("");
  };

  return (
    <MaxWidthWrapper>
      <div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
        <div className="flex h-[calc(100vh-160px)] w-full flex-col items-start justify-start gap-5 overflow-y-auto rounded-xl border p-5 shadow">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex w-fit max-w-3/4 items-start justify-start gap-2.5", {
                "mr-auto": message.role === "assistant",
                "ml-auto": message.role === "user",
              })}
            >
              {message.role === "user" ? (
                <img
                  src="https://ui.shadcn.com/avatars/01.png"
                  alt="avatar"
                  className="order-2 size-9 shrink-0 rounded-full border object-cover"
                />
              ) : (
                <div className="order-1 size-9 shrink-0 rounded-full border bg-muted p-2">
                  <Bot className="size-full" />
                </div>
              )}
              <span
                className={cn("rounded-lg px-4 py-2 text-sm", {
                  "order-2 bg-muted text-left": message.role === "assistant",
                  "order-1 bg-primary text-right text-white dark:text-black": message.role === "user",
                })}
              >
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex w-full items-center justify-center gap-2.5"
        >
          <Input
            className="flex-1"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" size="icon" variant="outline">
            <Send />
          </Button>
        </form>
      </div>
    </MaxWidthWrapper>
  );
};

export default ChatInterface;
