declare type Message = {
  id: number;
  content: string;
  createdAt: string;
  role: "user" | "assistant";
};

declare type GlobalState = {
  chat_session_id: string;
  user: LoginResponse | null;
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

declare type Login = {
  email: string;
  password: string;
}

declare type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user_id: string;
  employee_id: string;
  role: string;
  company_id: string;
};