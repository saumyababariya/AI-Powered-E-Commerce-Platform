import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/pages.css";

const OrderConfirmedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <div className="confirmed-wrapper">
          <div className="confirmed-badge">
            ✓
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--dark-slate)" }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: "var(--light-slate)", lineHeight: 1.6 }}>
            Thank you for shopping with Trendy Threads! Your payment is confirmed and our warehouse is packaging your styles.
          </p>
          <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
            Redirecting you to the home catalog shortly...
          </div>
          <button 
            className="btn-primary" 
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            Go Home Immediately
          </button>
        </div>
      </main>
    </>
  );
};

export default OrderConfirmedPage;
