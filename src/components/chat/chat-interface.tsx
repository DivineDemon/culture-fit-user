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
    setMessage("");
    setLoading(true);

    const result = await callWebhook(chat_session_id, userMessage.content, user?.company_id || "");

    if (result.success) {
      const chatContent = result.data?.[0]?.output?.chat || "No response received";
      const assistantMessage: ParsedMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: chatContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Message sent successfully!");
    } else {
      const errorMessage: ParsedMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${result.error}`,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
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
