import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LuTriangleAlert } from "react-icons/lu";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

const AdminLogin = () => {
  const { loginUser, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if already logged in as Admin
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleAdminLoginSubmit = (credentials) => {
    const res = loginUser(credentials.email, credentials.password);
    if (res.success && res.role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  const footer = (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ fontWeight: 600, color: "var(--warning)" }}>
        <div className="login-warning" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><LuTriangleAlert /> Administrator Portal Only</div>
      </div>
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
        Looking for shopper sign in?{" "}
        <Link to="/login" className="auth-link">
          User Portal
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <LoginForm
          title="Admin Portal"
          submitText="Access Dashboard"
          onSubmit={handleAdminLoginSubmit}
          footerContent={footer}
        />
      </main>
    </>
  );
};

export default AdminLogin;
