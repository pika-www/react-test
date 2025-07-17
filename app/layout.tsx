"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import Toast from "@/components/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 默认是 dark，但实际会在 useEffect 中被 localStorage 替换
  const [theme, setTheme] = useState("dark");
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: string;
  }>({ visible: false, message: "", type: "info" });

  // 在组件挂载时读取 localStorage 中的主题
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      // 默认 dark
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // 保存到本地

    document.documentElement.setAttribute("data-theme", newTheme); // 设置 html 上的 data-theme

    setToast({
      visible: true,
      message: `已切换到 ${newTheme} 主题`,
      type: "success",
    });
  };

  return (
    <html
      lang="en"
      data-theme={theme}
      style={{ width: "100%", height: "100%" }}
    >
      <body style={{ padding: "0", margin: "0" }}>
        <Provider store={store}>
          {children}
          <button onClick={toggleTheme}>切换主题</button>
          {toast.visible && (
            <Toast
              message={toast.message}
              type={toast.type as "success" | "error" | "info" | "warning"}
              onClose={() => setToast({ ...toast, visible: false })}
            />
          )}
        </Provider>
      </body>
    </html>
  );
}
