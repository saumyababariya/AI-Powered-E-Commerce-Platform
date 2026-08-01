import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LuHeart } from "react-icons/lu";
import "../styles/pages.css";
import { ColorSwatch } from "../utils/colourMapping";

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(AppContext);
  const navigate = useNavigate();

  // Helper to determine the image URL
  const getProductImage = () => {
    if (!product || !product.images) return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500";
    if (typeof product.images === "object" && !Array.isArray(product.images)) {
      // It's a color-mapped object (e.g., { blue: "...", pink: "..." })
      const firstColorKey = Object.keys(product.images)[0];
      return product.images[product.color?.toLowerCase()] || product.images[firstColorKey];
    }
    if (Array.isArray(product.images)) {
      return product.images[0];
    }
    return product.images;
  };

  const imageUrl = getProductImage();
  const hasDiscount = product.discount && Number(product.discount) > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - Number(product.discount) / 100)) 
    : product.price;

  const isWishlisted = wishlist.some((item) => String(item.id) === String(product.id));

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product, product.size || "M", product.color);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.size || "M", product.color);
  };

  return (
    <div className="prod-card animate-fade-in">
      {/* Discount Tag */}
      {hasDiscount && (
        <div className="prod-badge">{product.discount}% OFF</div>
      )}

      {/* Wishlist Button */}
      <button 
        className={`prod-wishlist-btn ${isWishlisted ? "active" : ""}`} 
        onClick={handleWishlistClick}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <LuHeart fill={isWishlisted ? "currentColor" : "none"} size={20} />
      </button>

      {/* Product Image */}
      <div className="prod-img-container" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={imageUrl} alt={product.name} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"; }} />
      </div>

      {/* Product Info */}
      <div className="prod-info">
        <span className="prod-category">{product.category}</span>
        <h3 className="prod-name" onClick={() => navigate(`/product/${product.id}`)}>
          {product.name}
        </h3>

        {/* Color and Size attributes */}
        <div className="prod-details-row" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {product.color && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              Color: <ColorSwatch colourName={product.color} showNameAlways={true} />
            </span>
          )}
          {product.size && <span>Size: {product.size}</span>}
        </div>

        {/* Pricing */}
        <div className="prod-price-row">
          <span className="price-current">₹{discountedPrice}</span>
          {hasDiscount && (
            <span className="price-original">₹{product.price}</span>
          )}
        </div>

        {/* Action Button */}
        <button className="btn-primary prod-action-btn" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
