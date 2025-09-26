import { setChatSessionId } from "../slices/global";
import { api } from "./core";

export const chatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChats: build.query({
      query: () => ({
        url: "/chat-sessions/",
        method: "GET",
      }),
      providesTags: ["Chats"],
      transformResponse: (response: Chat[]) => response,
    }),
    postChat: build.mutation({
      query: (chat: PostChat) => ({
        url: "/chat-sessions/",
        method: "POST",
        body: chat,
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const response = (await queryFulfilled) as unknown as { data: Chat };
        dispatch(setChatSessionId(response.data.session_id));
      },
    }),
    getChat: build.query({
      query: (session_id: string) => ({
        url: `/chat-sessions/${session_id}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
      transformResponse: (response: GetChat) => response.ai_results,
    }),
    updateChat: build.mutation({
      query: (chat: Chat) => ({
        url: `/chat-sessions/${chat.session_id}`,
        method: "PUT",
        body: chat,
      }),
      invalidatesTags: ["Chat", "Chats"],
    }),
    deleteChat: build.mutation({
      query: (session_id: string) => ({
        url: `/chat-sessions/${session_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat", "Chats"],
    }),
  }),
});

export const { useGetChatsQuery, usePostChatMutation, useGetChatQuery, useUpdateChatMutation, useDeleteChatMutation } =
  chatApi;
