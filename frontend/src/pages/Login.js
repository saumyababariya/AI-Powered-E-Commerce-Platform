import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

const Login = () => {
  const { loginUser, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleLoginSubmit = (credentials) => {
    const res = loginUser(credentials.email, credentials.password);
    if (res.success) {
      if (res.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  };

  const footer = (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div>
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">
          Sign Up
        </Link>
      </div>
      <div style={{ fontSize: "0.8rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
        Are you an Administrator?{" "}
        <Link to="/admin-login" className="auth-link">
          Admin Portal
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <LoginForm
          title="User Sign In"
          submitText="Log In"
          onSubmit={handleLoginSubmit}
          footerContent={footer}
        />
      </main>
    </>
  );
};

export default Login;
