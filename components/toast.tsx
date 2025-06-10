import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

const toastStyles: Record<
  "container" | "success" | "error" | "warning" | "info",
  React.CSSProperties
> = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    minWidth: "200px",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#fff",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    opacity: 0,
    transform: "translateX(100%)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  success: { backgroundColor: "#4caf50" },
  error: { backgroundColor: "#f44336" },
  warning: { backgroundColor: "#ff9800" },
  info: { backgroundColor: "#2196f3" },
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    const removeTimer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration + 300);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      style={{
        ...toastStyles.container,
        ...toastStyles[type],
        opacity: visible ? 0.9 : 0,
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {message}
    </div>
  );
}
