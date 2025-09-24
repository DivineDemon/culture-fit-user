declare type Message = {
  id: number;
  content: string;
  createdAt: string;
  role: "user" | "assistant";
};