import { Iuser } from "@/@types/user";
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth";

export interface initialState {
  user: {
    id: string | undefined;
    email: string | undefined;
    second_name: string | undefined;
    first_name: string | undefined;
    img_url: string | undefined;
    isActivated: boolean | undefined;
    exp: number | undefined;
    iat: number | undefined;
  } | null;
}

const initialState: initialState = {
  user: {
    id: undefined,
    email: undefined,
    first_name: undefined,
    second_name: undefined,
    img_url: undefined,
    isActivated: undefined,
    exp: undefined,
    iat: undefined,
  },
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
