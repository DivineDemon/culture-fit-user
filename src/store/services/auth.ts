import { setUser } from "../slices/global";
import { api } from "./core";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body: Login) => ({
        url: "/auth/employee/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = (await queryFulfilled) as {
          data: {
            status_code: number;
            message: string;
            data: LoginResponse;
          };
        };

        dispatch(setUser(data.data));
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
