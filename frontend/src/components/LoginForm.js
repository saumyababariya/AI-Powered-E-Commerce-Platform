import React, { useState } from "react";
import "../styles/pages.css";

const LoginForm = ({
  title = "Log In",
  isSignup = false,
  submitText = "Sign In",
  onSubmit = () => {},
  footerContent = null
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    onSubmit({ name, email, password });
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{title}</h2>
        <p>{isSignup ? "Create a shopper account" : "Enter your credentials to continue"}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div 
            style={{ 
              color: "var(--error)", 
              backgroundColor: "var(--error-bg)", 
              padding: "0.5rem", 
              borderRadius: "var(--radius-sm)", 
              fontSize: "0.85rem",
              textAlign: "center",
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        {isSignup && (
          <div className="auth-form-group">
            <label htmlFor="name-input">Full Name</label>
            <input
              id="name-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth-form-group">
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
          {submitText}
        </button>
      </form>

      {footerContent && (
        <div className="auth-footer">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
