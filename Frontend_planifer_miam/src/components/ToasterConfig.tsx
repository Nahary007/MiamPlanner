import React from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";

const ToasterConfig: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === "dark" ? "#374151" : "#f9fafb",
          color: theme === "dark" ? "#f9fafb" : "#111827",
          border: theme === "dark" ? "1px solid #4b5563" : "1px solid #e5e7eb",
        },
        success: {
          style: {
            background: "#10b981",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        },
      }}
    />
  );
};

export default ToasterConfig;
