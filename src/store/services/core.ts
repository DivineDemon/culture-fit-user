import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/types/global";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL as string,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).global.user?.access_token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWith401Handling: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // if (result.error?.status === 401 || result.error?.status === 403) {
  //   localStorage.clear();
  //   window.location.replace("/");
  //   toast.error("Session Expired! Please Login Again.");
  // }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWith401Handling,
  keepUnusedDataFor: 5,
  tagTypes: ["Chat", "Chats"],
  endpoints: () => ({}),
});
