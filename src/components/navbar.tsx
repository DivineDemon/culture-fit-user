import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteChatMutation, usePostChatMutation } from "@/store/services/chat";
import { setChatSessionId } from "@/store/slices/global";
import type { RootState } from "@/types/global";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import WarningModal from "./warning-modal";

const Navbar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [createChat, { isLoading: createChatLoading }] = usePostChatMutation();
  const [deleteChat, { isLoading }] = useDeleteChatMutation();
  const { chat_session_id } = useSelector((state: RootState) => state.global);

  const { open: sidebarOpen } = useSidebar();

  const handleDeleteChat = async () => {
    const response = await deleteChat(chat_session_id);

    if (response.data) {
      dispatch(setChatSessionId(""));
      toast.success("Chat deleted successfully!");
    } else {
      toast.error("Failed to delete chat!");
    }
  };

  const handleCreateChat = async () => {
    const response = await createChat({
      end_time: new Date().toISOString(),
      start_time: new Date().toISOString(),
      summary: "Employee Culture Assessment",
      topic: `Chat ${new Date().toISOString()}`,
    });

    if (response.data) {
      dispatch(setChatSessionId(response.data.session_id));
      toast.success("Chat created successfully!");
    }
  };

  return (
    <>
      <nav className="flex h-16 w-full flex-row items-center justify-between border-b p-3.5">
        <div className="flex items-center justify-center gap-2.5">
          <SidebarTrigger className="size-9 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50" />

          {!sidebarOpen && (
            <Button size="icon" variant="outline" className="shrink-0" onClick={handleCreateChat}>
              {createChatLoading ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          )}
        </div>

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
