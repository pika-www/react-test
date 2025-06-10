"use client";

import "./globals.css";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import Toast from "@/components/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState("light");
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: string;
  }>({ visible: false, message: "", type: "info" });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    setToast({
      visible: true,
      message: `已切换到 ${newTheme} 主题`,
      type: "success",
    });
  };

  return (
    <html lang="en"  data-theme={theme}>
      <body>
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
