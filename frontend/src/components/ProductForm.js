import React, { useState, useEffect } from "react";
import "../styles/admin.css";

const ProductForm = ({
  onSubmit = () => {},
  initialData = null,
  submitText = "Save Product"
}) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("M");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState("dress");
  const [error, setError] = useState("");

  const categories = ["dress", "shirt", "top", "jacket", "skirt", "jeans", "kurti", "fashion", "accessories", "books", "beauty", "electronics", "home & kitchen", "sports", "toys"];
  const sizes = ["XS", "S", "M", "L", "XL", "32"];

  useEffect(() => {
    if (initialData) {
      setId(initialData.id || "");
      setName(initialData.name || "");
      
      // Handle image value: if it's an object, get the first color URL or serialise
      if (initialData.images) {
        if (typeof initialData.images === "object" && !Array.isArray(initialData.images)) {
          setImageUrl(initialData.images[Object.keys(initialData.images)[0]] || "");
        } else if (Array.isArray(initialData.images)) {
          setImageUrl(initialData.images[0] || "");
        } else {
          setImageUrl(initialData.images);
        }
      } else {
        setImageUrl("");
      }

      setColor(initialData.color || "");
      setPrice(initialData.price || "");
      setSize(initialData.size || "M");
      setDiscount(initialData.discount || "0");
      setCategory(initialData.category || "dress");
    } else {
      setId("");
      setName("");
      setImageUrl("");
      setColor("");
      setPrice("");
      setSize("M");
      setDiscount("0");
      setCategory("dress");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!String(id).trim() || !name.trim() || !imageUrl.trim() || !price || !category.trim()) {
      setError("Product ID, Name, Image URL, Category, and Price are required.");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setError("Price must be a valid positive number.");
      return;
    }

    if (isNaN(discount) || Number(discount) < 0 || Number(discount) > 100) {
      setError("Discount must be a number between 0 and 100.");
      return;
    }

    const isColourCategory = ["fashion", "accessories", "dress", "shirt", "top", "jacket", "skirt", "jeans", "kurti"].includes(category.toLowerCase().trim());
    const productPayload = {
      id: isNaN(id) ? id : Number(id),
      name: name.trim(),
      images: [imageUrl.trim()],
      category: category.toLowerCase(),
      color: isColourCategory ? (color.trim() || "Default") : "",
      price: Number(price),
      size: size,
      discount: Number(discount)
    };

    onSubmit(productPayload);

    // Reset if it's a new product add
    if (!initialData) {
      setId("");
      setName("");
      setImageUrl("");
      setColor("");
      setPrice("");
      setSize("M");
      setDiscount("0");
      setCategory("dress");
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {error && (
        <div 
          style={{ 
            gridColumn: "span 2",
            color: "var(--error)", 
            backgroundColor: "var(--error-bg)", 
            padding: "0.75rem", 
            borderRadius: "var(--radius-sm)", 
            fontSize: "0.85rem",
            fontWeight: 500
          }}
        >
          {error}
        </div>
      )}

      {/* Product ID */}
      <div className="form-group">
        <label htmlFor="prod-id">Product ID</label>
        <input
          id="prod-id"
          type="text"
          placeholder="e.g. 101"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={!!initialData} // Disable editing ID in edit mode
        />
      </div>

      {/* Product Name */}
      <div className="form-group">
        <label htmlFor="prod-name">Product Name</label>
        <input
          id="prod-name"
          type="text"
          placeholder="e.g. Vintage Denim Jacket"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Image URL */}
      <div className="form-group full-width">
        <label htmlFor="prod-image">Product Image URL</label>
        <input
          id="prod-image"
          type="text"
          placeholder="e.g. /images/denim-jacket.png or HTTPS URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="prod-category">Category</label>
        <select
          id="prod-category"
          value={category}
          onChange={(e) => {
            const newCat = e.target.value;
            setCategory(newCat);
            const isNewColCat = ["fashion", "accessories", "dress", "shirt", "top", "jacket", "skirt", "jeans", "kurti"].includes(newCat.toLowerCase().trim());
            if (!isNewColCat) {
              setColor("");
            }
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      {["fashion", "accessories", "dress", "shirt", "top", "jacket", "skirt", "jeans", "kurti"].includes(category.toLowerCase().trim()) && (
        <div className="form-group">
          <label htmlFor="prod-color">Color</label>
          <input
            id="prod-color"
            type="text"
            placeholder="e.g. Blue"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      )}

      {/* Price */}
      <div className="form-group">
        <label htmlFor="prod-price">Price (₹)</label>
        <input
          id="prod-price"
          type="number"
          placeholder="e.g. 1599"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Discount */}
      <div className="form-group">
        <label htmlFor="prod-discount">Discount Percentage (%)</label>
        <input
          id="prod-discount"
          type="number"
          placeholder="e.g. 15"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>

      {/* Size */}
      <div className="form-group">
        <label htmlFor="prod-size">Default Size</label>
        <select
          id="prod-size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
