import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalState = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWdpbWFyay5kZXYxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1ODgxMDg2MSwidHlwZSI6ImFjY2VzcyJ9.G2yrAj4YSGXWkIk8ctPpWbg39YhQxyNpqHPdSH70u3k",
  chat_session_id: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload as string;
    },
    setChatSessionId: (state, action) => {
      state.chat_session_id = action.payload as string;
    },
  },
});

export const { setToken, setChatSessionId } = globalSlice.actions;
export default globalSlice.reducer;
