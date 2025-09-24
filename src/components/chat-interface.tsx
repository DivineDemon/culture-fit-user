import { Bot, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { callWebhook } from "@/lib/api";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatInterface = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    const result = await callWebhook([...messages, userMessage], currentMessage);

    if (result.success) {
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: JSON.stringify(result.data, null, 2),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Message sent successfully!");
    } else {
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: `Error: ${result.error}`,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error(`Failed to send message: ${result.error}`);
    }

    setIsLoading(false);
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
            disabled={isLoading}
          />
          <Button type="submit" size="icon" variant="outline" disabled={isLoading || !message.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </MaxWidthWrapper>
  );
};

export default ChatInterface;
