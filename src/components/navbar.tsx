import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteChatMutation } from "@/store/services/chat";
import type { RootState } from "@/types/global";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import WarningModal from "./warning-modal";

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteChat, { isLoading }] = useDeleteChatMutation();
  const { chat_session_id } = useSelector((state: RootState) => state.global);

  const handleDeleteChat = async () => {
    const response = await deleteChat(chat_session_id);

    if (response.data) {
      toast.success("Chat deleted successfully!");
    } else {
      toast.error("Failed to delete chat!");
    }
  };

  return (
    <>
      <nav className="flex h-16 w-full flex-row items-center justify-between border-b p-3.5">
        <SidebarTrigger />
        <div className="flex items-center justify-center gap-2.5">
          {chat_session_id && chat_session_id !== "" && pathname === "/chat" && (
            <Button size="default" variant="destructive" onClick={handleDeleteChat}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Delete Chat"}
            </Button>
          )}
          <ModeToggle />
        </div>
      </nav>
      <WarningModal
        open={open}
        title="Are you sure?"
        text="You'll be deleting this chat. This action cannot be undone."
        setOpen={setOpen}
        cta={handleDeleteChat}
        isLoading={isLoading}
      />
    </>
  );
};

export default Navbar;
