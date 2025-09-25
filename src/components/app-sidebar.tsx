import { Loader2, MessageCircle, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeleteChatMutation, useGetChatsQuery, usePostChatMutation } from "@/store/services/chat";
import { setChatSessionId } from "@/store/slices/global";
import type { RootState } from "@/types/global";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { data } = useGetChatsQuery({});
  const [createChat, { isLoading }] = usePostChatMutation();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const { chat_session_id } = useSelector((state: RootState) => state.global);

  const handleCreateChat = async () => {
    const response = await createChat({
      topic: "New Chat",
      summary: "New Chat",
      end_time: new Date().toISOString(),
      start_time: new Date().toISOString(),
    });

    if (response.data) {
      dispatch(setChatSessionId(response.data.session_id));
      toast.success("Chat created successfully!");
    }
  };

  const handleDeleteChat = async (session_id: string) => {
    const response = await deleteChat(session_id);

    if (response.data) {
      toast.success("Chat deleted successfully!");
    }
  };

  return (
    <Sidebar>
      <SidebarContent className="p-0">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex w-full items-center justify-center border-b p-2.5">
              <span className="flex-1 text-left">Chats</span>
              <Button type="button" size="icon" variant="outline" onClick={handleCreateChat}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
              </Button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="p-0">
              {data?.map((chat) => (
                <SidebarMenuItem key={chat.session_id} className="p-2.5">
                  <SidebarMenuButton
                    asChild
                    className={cn("h-fit cursor-pointer p-2.5", {
                      "bg-accent": chat.session_id === chat_session_id,
                    })}
                    onClick={() => dispatch(setChatSessionId(chat.session_id))}
                  >
                    <div className="flex w-full items-center justify-center gap-2.5">
                      <div className="flex flex-1 items-center justify-center gap-2.5">
                        <MessageCircle className="size-4" />
                        <span className="flex-1 text-left capitalize">{chat.topic}</span>
                      </div>
                      <Button size="icon" variant="destructive" onClick={() => handleDeleteChat(chat.session_id)}>
                        {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
                      </Button>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
