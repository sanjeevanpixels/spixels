import React from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./index.css";

document.documentElement.classList.remove('dark');

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* reducedMotion="user" respects the OS "reduce motion" setting for all Motion animations */}
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <App />
      </ToastProvider>
    </MotionConfig>
  </React.StrictMode>,
);
