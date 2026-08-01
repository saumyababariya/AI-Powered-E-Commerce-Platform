import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { LuHeart } from "react-icons/lu";
import "../styles/pages.css";
import { ColorSwatch } from "../utils/colourMapping";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(AppContext);
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

  const handleAddToCart = (item) => {
    addToCart(item, item.size || "M", item.color);
  };

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="page-title" style={{ textAlign: "left" }}>Your Wishlist</h1>

        {wishlist.length > 0 ? (
          <div className="wishlist-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", justifyItems: "stretch" }}>
            {wishlist.map((item) => {
              const hasDiscount = item.discount && Number(item.discount) > 0;
              const finalPrice = hasDiscount 
                ? Math.round(item.price * (1 - Number(item.discount) / 100)) 
                : item.price;

              return (
                <div key={item.id} className="wishlist-card" style={{ width: "100%", padding: "1.25rem", border: "1px solid var(--border-color)" }}>
                  <img 
                    src={getProductImage(item)} 
                    alt={item.name} 
                    className="wishlist-img" 
                    style={{ width: "100%", height: "180px", borderRadius: "var(--radius-md)" }}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"; }}
                  />
                  
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--dark-slate)", marginTop: "0.5rem" }}>
                    {item.name}
                  </h2>
                  
                  <div style={{ fontSize: "0.85rem", color: "var(--light-slate)", display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                    {item.color && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        Color: <ColorSwatch colourName={item.color} showNameAlways={true} />
                      </span>
                    )}
                  </div>

                  <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--dark-slate)" }}>
                    ₹{finalPrice}{" "}
                    {hasDiscount && (
                      <span style={{ fontSize: "0.8rem", textDecoration: "line-through", color: "var(--light-slate)", fontWeight: "normal" }}>
                        ₹{item.price}
                      </span>
                    )}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", marginTop: "0.5rem" }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: "0.5rem", fontSize: "0.85rem" }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add To Cart
                    </button>
                    <button 
                      className="btn-outline remove-button" 
                      style={{ margin: 0, padding: "0.5rem", fontSize: "0.85rem" }}
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><LuHeart /></span>
            <h3>Your Wishlist is Empty</h3>
            <p>You haven't saved any items yet. Browse through our items and tap the heart icon to save products here!</p>
            <Link to="/">
              <button className="btn-primary">Browse Catalogue</button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default WishlistPage;
