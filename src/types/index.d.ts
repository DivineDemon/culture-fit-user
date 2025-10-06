declare type Message = {
  id: number;
  message: string;
  session_id: string;
};

declare type GlobalState = {
  chat_session_id: string;
  user: LoginResponse | null;
};

declare type Detail = {
  full_name: string;
};

declare type Chat = {
  summary: string;
  topic: string;
  start_time: string;
  end_time: string;
  session_id: string;
  user_id: string;
  created_at: string;
  user: Detail;
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

declare type GetChat = {
  session_id: string;
  user_id: string;
  summary: string;
  topic: string;
  start_time: string;
  end_time: string;
  created_at: string;
  user: Detail[];
  ai_results: Message[];
};

declare type ParsedMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};