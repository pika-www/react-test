// src/api/user/login.ts
import request from "@/api/index";
import type { ApiResponse } from "@/types/api";

interface LoginData {
  nick_name: string;
  token: string;
  // 其他字段可以补充或使用索引签名
  [key: string]: unknown;
}

export const login = (params: {
  phone: string;
  pwd: string;
  app_type: string;
  way: string;
}): Promise<ApiResponse<LoginData>> => {
  return request.post<ApiResponse<LoginData>>("/login", params);
};

export const getUserInfo = () => {
  return request.get<ApiResponse<LoginData>>("/user/info");
};
