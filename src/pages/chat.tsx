import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import ChatInterface from "@/components/chat/chat-interface";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RootState } from "@/types/global";

const Chat = () => {
  const { chat_session_id } = useSelector((state: RootState) => state.global);

  return chat_session_id && chat_session_id !== "" ? (
    <ChatInterface />
  ) : (
    <div className="flex h-full w-full flex-col items-start justify-between p-5">
      <div className="mx-auto flex h-fit w-full flex-col justify-center">
        <div className="font-semibold text-xl md:text-2xl">Hello there!</div>
        <div className="text-xl text-zinc-500 md:text-2xl">Ready for your culture assessment?</div>
      </div>
      <div className="flex w-full items-start justify-start gap-2.5">
        <Textarea disabled={true} className="h-24 flex-1" placeholder="Type your message here..." />
        <Button size="icon" type="button" disabled={true} variant="outline">
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
