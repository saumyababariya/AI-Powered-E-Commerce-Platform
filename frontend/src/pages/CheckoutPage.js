import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import "../styles/pages.css";

const CheckoutPage = () => {
  const { cart, clearCart, showToast, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Form states
  const [address, setAddress] = useState({
    homeNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Load saved address from localStorage if any
  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    } else if (user) {
      // Attempt to load from user profile details
      const savedProfiles = localStorage.getItem("userProfiles");
      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        if (profiles[user.email] && profiles[user.email].address) {
          setAddress((prev) => ({ ...prev, street: profiles[user.email].address }));
        }
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    // Validations
    if (!address.homeNo.trim() || !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim() || !address.phone.trim()) {
      showToast("Please fill in all delivery details.", "error");
      return;
    }

    if (address.phone.trim().length < 10) {
      showToast("Please enter a valid phone number.", "error");
      return;
    }

    // Save address for future convenience
    localStorage.setItem("shippingAddress", JSON.stringify(address));

    // Clear cart and route
    clearCart();
    showToast("Order placed successfully!", "success");
    navigate("/order-confirmed");
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const discountTotal = cart.reduce((acc, item) => {
    if (item.discount && Number(item.discount) > 0) {
      return acc + Math.round(item.price * (Number(item.discount) / 100));
    }
    return acc;
  }, 0);
  const finalTotal = subtotal - discountTotal;
  const shippingFee = finalTotal >= 1000 ? 0 : 49;
  const grandTotal = Math.max(0, finalTotal + shippingFee);

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Return to Cart
        </button>

        <h1 className="page-title" style={{ textAlign: "left" }}>Billing & Checkout</h1>

        <form onSubmit={handleConfirmOrder} className="checkout-grid">
          {/* Left Column - Shipping & Payment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Delivery address card */}
            <div className="checkout-section-card">
              <h2 className="summary-title" style={{ fontSize: "1.15rem", borderBottom: "none", marginBottom: "1rem" }}>
                📍 Delivery Address
              </h2>
              
              <div className="checkout-form">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>Home No.</label>
                    <input 
                      type="text" 
                      name="homeNo" 
                      value={address.homeNo} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 402"
                    />
                  </div>
                  <div className="form-group">
                    <label>Street / Area</label>
                    <input 
                      type="text" 
                      name="street" 
                      value={address.street} 
                      onChange={handleInputChange} 
                      placeholder="e.g. MG Road, Sector 4"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={address.city} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Delhi"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={address.state} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Delhi"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={address.pincode} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 110001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={address.phone} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment options card */}
            <div className="checkout-section-card">
              <h2 className="summary-title" style={{ fontSize: "1.15rem", borderBottom: "none", marginBottom: "1rem" }}>
                💳 Payment Method
              </h2>
              
              <div className="payment-options">
                <label className={`payment-option-label ${paymentMethod === "UPI" ? "selected" : ""}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI" 
                    checked={paymentMethod === "UPI"} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "auto" }}
                  /> 
                  <span>UPI / GPay / PhonePe</span>
                </label>

                <label className={`payment-option-label ${paymentMethod === "Credit Card" ? "selected" : ""}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Credit Card" 
                    checked={paymentMethod === "Credit Card"} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "auto" }}
                  /> 
                  <span>Credit Card / Debit Card</span>
                </label>

                <label className={`payment-option-label ${paymentMethod === "Netbanking" ? "selected" : ""}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Netbanking" 
                    checked={paymentMethod === "Netbanking"} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "auto" }}
                  /> 
                  <span>Net Banking Transfer</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Final Invoice Bill */}
          <div className="summary-box">
            <h2 className="summary-title">Final Invoice</h2>
            
            <div className="checkout-bill-list">
              {cart.map((item, idx) => {
                const itemFinal = item.discount 
                  ? Math.round(item.price * (1 - item.discount / 100)) 
                  : item.price;
                return (
                  <div key={idx} className="checkout-bill-item">
                    <div>
                      <span>{item.name}</span>
                      <div style={{ fontSize: "0.75rem", color: "var(--light-slate)" }}>
                        {item.color} • {item.size}
                      </div>
                    </div>
                    <span>₹{itemFinal}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row" style={{ color: "var(--secondary)" }}>
              <span>Savings</span>
              <span>- ₹{discountTotal}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span style={{ color: shippingFee === 0 ? "var(--success)" : "inherit", fontWeight: shippingFee === 0 ? 600 : "normal" }}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>

            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button type="submit" className="btn-primary checkout-btn">
              Confirm & Place Order (₹{grandTotal})
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default CheckoutPage;
