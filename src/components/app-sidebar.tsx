import { ChevronUp, Loader2, MessageCircle, Plus, User2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/img/logo.jpg";
import { cn } from "@/lib/utils";
import { useGetChatsQuery, usePostChatMutation } from "@/store/services/chat";
import { setChatSessionId, setUser } from "@/store/slices/global";
import type { RootState } from "@/types/global";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import WarningModal from "./warning-modal";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useGetChatsQuery({});
  const [open, setOpen] = useState<boolean>(false);
  const [createChat, { isLoading }] = usePostChatMutation();
  const { chat_session_id } = useSelector((state: RootState) => state.global);

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

  const logout = () => {
    dispatch(setUser(null));
    dispatch(setChatSessionId(""));

    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-0">
          <div className="flex h-16 w-full items-center justify-center gap-2.5 border-b p-2.5">
            <div className="flex flex-1 items-center justify-start gap-2.5">
              <img src={Logo} alt="logo" className="size-9 rounded-md object-cover" />
              <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                <span className="w-full text-left font-semibold text-[14px] capitalize leading-[14px]">
                  Culture Fit
                </span>
                <span className="w-full text-left text-[12px] text-muted-foreground leading-[12px]">
                  Culture Assesment
                </span>
              </div>
            </div>
            <Button size="icon" variant="outline" className="shrink-0" onClick={handleCreateChat}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data?.map((chat) => (
                  <SidebarMenuItem key={chat.session_id}>
                    <SidebarMenuButton
                      className={cn("", {
                        "bg-accent": chat.session_id === chat_session_id,
                      })}
                      onClick={() => dispatch(setChatSessionId(chat.session_id))}
                    >
                      <MessageCircle className="size-4" />
                      <span className="flex-1 text-left">{chat.topic}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> supame123@gmail.com
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <Link to="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <WarningModal
        open={open}
        title="Are you sure?"
        text="You'll be signed out of your account."
        setOpen={setOpen}
        cta={logout}
      />
    </>
  );
};

export default AppSidebar;
