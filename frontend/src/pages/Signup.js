import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

const Signup = () => {
  const { registerUser, user } = useContext(AppContext);
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

  const handleSignupSubmit = (details) => {
    const success = registerUser(details.name, details.email, details.password);
    if (success) {
      navigate("/login");
    }
  };

  const footer = (
    <div>
      Already have an account?{" "}
      <Link to="/login" className="auth-link">
        Sign In
      </Link>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <LoginForm
          title="Create Account"
          isSignup={true}
          submitText="Register"
          onSubmit={handleSignupSubmit}
          footerContent={footer}
        />
      </main>
    </>
  );
};

export default Signup;
