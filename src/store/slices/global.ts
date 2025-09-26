import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalState = {
  user: null,
  chat_session_id: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChatSessionId: (state, action) => {
      state.chat_session_id = action.payload as string;
    },
  },
});

export const { setUser, setChatSessionId } = globalSlice.actions;
export default globalSlice.reducer;
