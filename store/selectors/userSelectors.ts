import { RootState } from "@/store";

export const selectIsLogin = (state: RootState) => !!state.user.token;
export const selectUserInfo = (state: RootState) => state.user.userInfo;
