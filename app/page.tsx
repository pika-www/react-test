"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/toast";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { selectIsLogin, selectUserInfo } from "@/store/selectors/userSelectors";
import { getUser, fetchUser } from "@/store/user";
import Login from "@/components/loginModal/index";

export default function Home() {
  const isLogin = useSelector(selectIsLogin);
  const userInfo = useSelector(selectUserInfo);
  const [hasHydrated, setHasHydrated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: string;
  }>({ visible: false, message: "", type: "info" });

  useEffect(() => {
    if (isLogin && !userInfo) {
      dispatch(fetchUser());
    }
  }, [isLogin, userInfo, dispatch]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return null;
  }

  const openUserInfo = () => {
    if (isLogin) {
      setToast({ visible: true, message: "已获取用户信息", type: "info" });
      console.log("用户信息", userInfo);
      dispatch(getUser());
    } else {
      setToast({ visible: true, message: "请先登录", type: "error" });
    }
  };

  return (
    <div>
      <h1 style={{ color: "var(--primary-color)" }}>Hello world</h1>
      <button onClick={openUserInfo}>获取用户信息</button>
      {isLogin ? <h1 style={{color:'var(--primary-color)'}}>已登录</h1> : <h1 style={{color:'var(--primary-color)'}}>未登录</h1>}
      {isLogin ? (
        <div>
          <h2>用户信息：</h2>
          <pre style={{color:'var(--primary-color)'}}>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      ) : null}
      <Login />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error" | "info" | "warning"}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
}
