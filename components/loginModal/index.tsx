"use client";

import React, { useState } from "react";
import "./login.scss";
import { login } from "@/api/user/login";
import { selectIsLogin } from "@/store/selectors/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  setToken,
  setUser,
  type LoginData,
  fetchUser,
} from "@/store/user";
import type { AppDispatch } from "@/store";

export default function LoginModal() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useSelector(selectIsLogin);
  const loginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      console.log(account, password, "login");
      const data = {
        app_type: "platform",
        phone: account,
        pwd: password,
        way: "phone_pwd",
      };

      const res = await login(data);
      console.log(res, "res");
      if (res.code === 20000) {
        console.log("登录成功");
        localStorage.setItem("token", res.data.token);
        dispatch(setToken(res.data.token));
        dispatch(fetchUser());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutClick = () => {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setUser({} as LoginData));
    dispatch(getUser());
  };

  return (
    <div className="password-input">
      {!isLogin ? (
        <form>
          <input
            type="text"
            placeholder="请输入账号"
            value={account}
            maxLength={11}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={loginClick}>
            登录
          </button>
        </form>
      ) : (
        <button onClick={logoutClick}>退出登录</button>
      )}
    </div>
  );
}
