"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/toast";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { selectIsLogin, selectUserInfo } from "@/store/selectors/userSelectors";
import { getUser, fetchUser } from "@/store/user";
import Login from "@/components/loginModal/index";
import Loading from "@/components/loading/loading";

export default function Home() {
  const isLogin = useSelector(selectIsLogin);
  const userInfo = useSelector(selectUserInfo);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (isLogin && !userInfo) {
      dispatch(fetchUser());
    }
  }, [isLogin, userInfo, dispatch]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOutLoading(true); // 开始 loading 收缩动画
      setTimeout(() => {
        setIsLoading(false); // 动画结束后卸载 loading
      }, 800); // 和 loading.scss 中动画时长一致
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!hasHydrated) return null;

  // **主内容透明度、滤镜控制，实现加载期间隐藏，加载结束渐显**
  return (
    <>
      {isLoading && <Loading fadeOut={fadeOutLoading} />}
      <div
        className="main-content"
        style={{
          opacity: isLoading ? 0.3 : 1, // loading期间半透明
          filter: isLoading ? "blur(3px)" : "none", // loading期间模糊
          pointerEvents: isLoading ? "none" : "auto", // loading期间不可交互
          transition: "opacity 0.6s ease, filter 0.6s ease",
        }}
      >
        <h1 style={{ color: "var(--primary-color)" }}>Hello world</h1>
        <button onClick={openUserInfo}>获取用户信息</button>
        <h1 style={{ color: "var(--primary-color)" }}>
          {isLogin ? "已登录" : "未登录"}
        </h1>
        {isLogin && (
          <div>
            <h2>用户信息：</h2>
            <pre style={{ color: "var(--primary-color)", width: "500px",overflow:"scroll" }}>
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}
        <Login />
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type as "success" | "error" | "info" | "warning"}
            onClose={() => setToast({ ...toast, visible: false })}
          />
        )}
      </div>
    </>
  );

  function openUserInfo() {
    if (isLogin) {
      setToast({ visible: true, message: "已获取用户信息", type: "info" });
      console.log("用户信息", userInfo);
      dispatch(getUser());
    } else {
      setToast({ visible: true, message: "请先登录", type: "error" });
    }
  }
}
