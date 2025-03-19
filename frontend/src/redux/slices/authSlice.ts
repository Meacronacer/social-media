import { Iuser } from "@/@types/user";
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth";

const userDefault = {
  _id: "",
  email: undefined,
  skills: [],
  description: "",
  first_name: undefined,
  second_name: undefined,
  img_url: undefined,
  isActivated: undefined,
  exp: undefined,
  iat: undefined,
};

export interface initialState {
  user: Iuser;
}

const initialState: initialState = {
  user: userDefault,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = userDefault;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
