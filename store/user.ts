// store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserInfo } from "@/api/user/login";
import type { UserInfo } from "@/types/user";

interface UserState {
  userInfo: LoginData | null;
  token?: string;
}

export interface LoginData {
  name?: string;
  phone?: number;
  email?: string;
  token?: string;
}

const initialState: UserState = {
  userInfo: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
};

export const fetchUser = createAsyncThunk<UserInfo>("user/info", async () => {
  const res = await getUserInfo();
  console.log(res, "user/info");
  if (res.code === 20000) {
    console.log("user data:", res.data);
    return res.data as unknown as UserInfo;
  } else {
    throw new Error("获取用户信息失败");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser(state) {
      return state;
    },
    setUser(state, action: PayloadAction<LoginData>) {
      state.userInfo = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      console.log("fetchUser fulfilled", action.payload);
      state.userInfo = action.payload;
    });
  },
});

export const { getUser, setUser, setToken } = userSlice.actions;
export default userSlice.reducer;
