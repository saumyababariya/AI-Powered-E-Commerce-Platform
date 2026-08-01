import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/toast.css";

const Toast = () => {
  const { toasts } = useContext(AppContext);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
