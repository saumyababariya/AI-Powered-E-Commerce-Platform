import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { LuTrash2, LuShoppingCart } from "react-icons/lu";
import "../styles/pages.css";
import { ColorSwatch } from "../utils/colourMapping";

const CartPage = () => {
  const { cart, removeFromCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Helper to determine the image URL
  const getProductImage = (item) => {
    if (!item || !item.images) return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200";
    if (typeof item.images === "object" && !Array.isArray(item.images)) {
      return item.images[item.color?.toLowerCase()] || item.images[Object.keys(item.images)[0]];
    }
    if (Array.isArray(item.images)) {
      return item.images[0];
    }
    return item.images;
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  const totalDiscount = cart.reduce((acc, item) => {
    if (item.discount && Number(item.discount) > 0) {
      return acc + Math.round(item.price * (Number(item.discount) / 100));
    }
    return acc;
  }, 0);

  const finalTotal = subtotal - totalDiscount;

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Continue Shopping
        </button>

        <h1 className="page-title" style={{ textAlign: "left" }}>Shopping Cart</h1>

        {cart.length > 0 ? (
          <div className="cart-layout">
            {/* Cart Items List */}
            <div className="cart-items-container">
              {cart.map((item) => {
                const hasDiscount = item.discount && Number(item.discount) > 0;
                const itemFinalPrice = hasDiscount 
                  ? Math.round(item.price * (1 - Number(item.discount) / 100)) 
                  : item.price;

                return (
                  <div key={item.cartId} className="cart-card">
                    <img 
                      src={getProductImage(item)} 
                      alt={item.name} 
                      className="cart-card-img" 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"; }}
                    />
                    
                    <div className="cart-card-details">
                      <h3 className="cart-card-name">{item.name}</h3>
                      <div className="cart-card-options" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <span>Size: <strong>{item.size}</strong></span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                          Color: <ColorSwatch colourName={item.color} showNameAlways={true} />
                        </span>
                      </div>
                      <div className="cart-card-price">
                        ₹{itemFinalPrice}{" "}
                        {hasDiscount && (
                          <span style={{ fontSize: "0.8rem", textDecoration: "line-through", color: "var(--light-slate)", fontWeight: "normal", marginLeft: "0.5rem" }}>
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      className="cart-card-remove" 
                      onClick={() => removeFromCart(item.cartId)}
                      title="Remove from cart"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary Panel */}
            <div className="summary-box">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="summary-row" style={{ color: "var(--secondary)" }}>
                <span>Discount saved</span>
                <span>- ₹{totalDiscount}</span>
              </div>

              <div className="summary-row">
                <span>Shipping charges</span>
                <span style={{ color: "var(--success)", fontWeight: 600 }}>FREE</span>
              </div>

              <div className="summary-row total">
                <span>Grand Total</span>
                <span>₹{finalTotal}</span>
              </div>

              <button 
                className="btn-primary checkout-btn" 
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><LuShoppingCart /></span>
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added anything to your cart yet. Explore our latest styles and make your choice!</p>
            <Link to="/">
              <button className="btn-primary">Shop Our Catalog</button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default CartPage;
