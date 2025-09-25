declare type Message = {
  id: number;
  content: string;
  createdAt: string;
  role: "user" | "assistant";
};

declare type GlobalState = {
  token: string;
  chat_session_id: string;
};

declare type Chat = {
  summary: string;
  topic: string;
  start_time: string;
  end_time: string;
  session_id: string;
  user_id: string;
  created_at: string;
};

declare type PostChat = {
  summary: string;
  topic: string;
  start_time: string;
  end_time: string;
};