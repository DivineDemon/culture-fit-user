import {
  ChevronUp,
  Loader2,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  User2,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
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
  const [createChat, { isLoading }] = usePostChatMutation();
  const { chat_session_id } = useSelector((state: RootState) => state.global);
  const User  = useSelector((state: RootState) => state.global.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [summary, setSummary] = useState("");
  const [topic, setTopic] = useState("");
  const [openLogout, setOpenLogout] = useState(false);

  const handleCreateChat = async () => {
    if (!summary.trim() || !topic.trim()) {
      toast.error("Please fill in both Summary and Topic!");
      return;
    }

    const response = await createChat({
      end_time: new Date().toISOString(),
      start_time: new Date().toISOString(),
      summary,
      topic,
    });

    if (response.data) {
      dispatch(setChatSessionId(response.data.session_id));
      toast.success("Chat created successfully!");
      setOpenDialog(false);
      setSummary("");
      setTopic("");
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
              <img
                src={Logo}
                alt="logo"
                className="size-9 rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                <span className="w-full text-left font-semibold text-[14px] capitalize leading-[14px]">
                  Culture Fit
                </span>
                <span className="w-full text-left text-[12px] text-muted-foreground leading-[12px]">
                  Culture Assesment
                </span>
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => setOpenDialog(true)}
            >
              <Plus />
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
                      onClick={() =>
                        dispatch(setChatSessionId(chat.session_id))
                      }
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
                    <span className="flex w-fit items-end rounded-full bg-primary p-2">
                      <User2 className="size-4" />
                    </span>
                    {User?.full_name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <Link to="/account" className="flex items-center">
                      <Settings className="mr-2.5 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setOpenLogout(true)}
                  >
                    <LogOut className="ml-0.5 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="mb-1 block font-medium text-sm">Topic</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-sm">Summary</label>
              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter summary"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChat} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WarningModal
        open={openLogout}
        title="Are you sure?"
        text="You'll be signed out of your account."
        setOpen={setOpenLogout}
        cta={logout}
      />
    </>
  );
};

export default AppSidebar;
