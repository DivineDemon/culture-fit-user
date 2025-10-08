import { Bot, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { callWebhook } from "@/lib/api";
import { cn, parseApiMessage } from "@/lib/utils";
import { useGetChatQuery } from "@/store/services/chat";
import type { RootState } from "@/types/global";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ParsedMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isLoading?: boolean;
}

const ChatInterface = () => {
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const { user, chat_session_id } = useSelector((state: RootState) => state.global);

  const { data } = useGetChatQuery(chat_session_id, {
    skip: !chat_session_id,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setMessages([]);

    if (data && data.length > 0) {
      const allParsedMessages: ParsedMessage[] = [];

      data.forEach((apiMessage: Message) => {
        const parsedMessages = parseApiMessage(apiMessage);
        allParsedMessages.push(...parsedMessages);
      });

      allParsedMessages.sort((a, b) => a.id - b.id);
      setMessages(allParsedMessages);
    }
  }, [data, chat_session_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;

    const userMessage: ParsedMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage: ParsedMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    setMessage("");
    setLoading(true);

    const userType = user?.is_role_model === true ? "role_model" : user?.role || "";

    const result = await callWebhook(
      chat_session_id,
      userMessage.content,
      user?.company_id || "",
      userType,
    );

    if (result.success) {
      const chatContent = result.data?.[0]?.output?.chat || "No response received";
      const assistantMessage: ParsedMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: chatContent,
        createdAt: new Date().toISOString(),
        isLoading: false,
      };

      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessage.id ? assistantMessage : msg)));
      toast.success("Message sent successfully!");
    } else {
      const errorMessage: ParsedMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${result.error}`,
        createdAt: new Date().toISOString(),
        isLoading: false,
      };

      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessage.id ? errorMessage : msg)));
      toast.error(`Failed to send message: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
      <div className="flex h-[calc(100vh-220px)] w-full flex-col items-start justify-start gap-5 overflow-y-auto rounded-xl border p-5 shadow">
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
                src="https://ui.shadcn.com/avatars/04.png"
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
                "order-1 bg-primary text-right text-white": message.role === "user",
              })}
            >
              {message.isLoading ? (
                <div className="flex items-center gap-2 p-2.5">
                  <div className="size-1.5 animate-[fadeDots_0.8s_infinite] rounded-full bg-white shadow-dot" />
                  <div
                    className="size-1.5 animate-[fadeDots_0.8s_infinite] rounded-full bg-white shadow-dot"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="size-1.5 animate-[fadeDots_0.8s_infinite] rounded-full bg-white shadow-dot"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              ) : (
                message.content
              )}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex w-full items-start justify-start gap-2.5"
      >
        <Textarea
          className="h-24 flex-1"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" size="icon" variant="outline" disabled={loading || !message.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
