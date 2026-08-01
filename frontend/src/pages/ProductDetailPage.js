import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { LuShoppingCart, LuHeart } from "react-icons/lu";
import "../styles/pages.css";
import { getColorInfo } from "../utils/colourMapping";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToWishlist, showToast, wishlist } = useContext(AppContext);

  const product = products.find((p) => String(p.id) === String(id));

  // Options states
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const isWishlisted = wishlist?.some((item) => String(item.id) === String(product?.id));

  // Determine available colors
  const hasColorMap = product?.images && typeof product.images === "object" && !Array.isArray(product.images);
  const colorsList = hasColorMap ? Object.keys(product.images) : (product?.color ? [product.color] : []);

  useEffect(() => {
    if (product) {
      const hasColorMap = product.images && typeof product.images === "object" && !Array.isArray(product.images);
      const colors = hasColorMap ? Object.keys(product.images) : (product.color ? [product.color] : []);
      // Preselect first color if available
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
      // Preselect default size if available
      if (product.size) {
        setSelectedSize(product.size);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Product Not Found</h2>
          <p>The product you are trying to view does not exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>
            Return Home
          </button>
        </div>
      </>
    );
  }

  // Get active image based on selected color
  const getDisplayImage = () => {
    if (hasColorMap && selectedColor) {
      return product.images[selectedColor.toLowerCase()] || Object.values(product.images)[0];
    }
    if (Array.isArray(product.images)) {
      return product.images[0];
    }
    return product.images;
  };

  const hasDiscount = product.discount && Number(product.discount) > 0;
  const finalPrice = hasDiscount 
    ? Math.round(product.price * (1 - Number(product.discount) / 100)) 
    : product.price;

  const hasColours = colorsList.length > 0 && colorsList.some(c => c && c.trim() !== "" && c.toLowerCase().trim() !== "default");

  const handleAddToCart = () => {
    if (hasColours && !selectedColor) {
      showToast("Please select a color option.", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size option.", "error");
      return;
    }
    addToCart(product, selectedSize, selectedColor);
  };

  const handleAddToWishlist = () => {
    if (hasColours && !selectedColor) {
      showToast("Please select a color option.", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size option.", "error");
      return;
    }
    addToWishlist(product, selectedSize, selectedColor);
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Catalog
        </button>

        <div className="detail-grid">
          {/* Left Column - Product Image */}
          <div className="detail-img-box">
            <img 
              src={getDisplayImage()} 
              alt={product.name} 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"; }}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="detail-info-box">
            <div className="detail-header">
              <span className="prod-category" style={{ fontSize: "0.9rem" }}>{product.category}</span>
              <h1 className="detail-name">{product.name}</h1>
            </div>

            {/* Pricing Section */}
            <div className="detail-price-box">
              <span className="price-current">₹{finalPrice}</span>
              {hasDiscount && (
                <>
                  <span className="price-original">₹{product.price}</span>
                  <span className="detail-discount">{product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="detail-description">
              This high-quality {product.name} is designed for comfort and modern aesthetic appeal. Fabricated with care using premium textiles, it fits perfectly into any contemporary wardrobe collection. Fits true to size.
            </p>

            {/* Colors Select */}
            {hasColours && (
              <div className="option-select-group">
                <span className="option-label">Select Color: <span style={{ fontWeight: "normal", color: "var(--light-slate)" }}>{selectedColor}</span></span>
                <div className="option-list">
                  {colorsList.map((colorName) => {
                    const { code, isKnown } = getColorInfo(colorName);

                    return (
                      <div key={colorName} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div 
                          className={`color-dot-wrapper ${selectedColor === colorName ? "selected" : ""}`}
                          onClick={() => setSelectedColor(colorName)}
                          title={colorName}
                        >
                          <span className="color-dot" style={{ backgroundColor: code }} />
                        </div>
                        {!isKnown && <span style={{ fontSize: "0.9rem", color: "var(--light-slate)" }}>{colorName}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Select */}
            <div className="option-select-group">
              <span className="option-label">Select Size: <span style={{ fontWeight: "normal", color: "var(--light-slate)" }}>{selectedSize}</span></span>
              <div className="option-list">
                {sizes.map((s) => (
                  <div
                    key={s}
                    className={`size-pill ${selectedSize === s ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart <LuShoppingCart style={{ marginLeft: "4px" }} />
              </button>
              <button className="btn-outline" onClick={handleAddToWishlist}>
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"} <LuHeart fill={isWishlisted ? "currentColor" : "none"} style={{ marginLeft: "4px" }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetailPage;
