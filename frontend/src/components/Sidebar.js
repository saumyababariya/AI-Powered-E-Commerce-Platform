import React from "react";
import "../styles/admin.css";
import "../styles/pages.css";
import { LuBarChart2, LuPlus, LuPackage } from "react-icons/lu";
import { getColorStyle } from "../utils/colourMapping";

const Sidebar = ({
  type = "admin", // "admin" or "filter"
  // Admin props
  activeTab = "overview",
  setActiveTab = () => {},
  // Filter props
  selectedColor = "",
  setSelectedColor = () => {},
  selectedSize = "",
  setSelectedSize = () => {},
  selectedCategory = "",
  setSelectedCategory = () => {},
  categories = [],
  resetFilters = () => {}
}) => {
  if (type === "admin") {
    return (
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("overview")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LuBarChart2 size={18} /> Overview
            </button>
          </li>
          <li className={`sidebar-item ${activeTab === "add-product" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("add-product")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LuPlus size={18} /> Add Product
            </button>
          </li>
          <li className={`sidebar-item ${activeTab === "manage-products" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("manage-products")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LuPackage size={18} /> Manage Products
            </button>
          </li>
        </ul>
      </aside>
    );
  }

  // Filter Sidebar for Shopping Catalog
  const colorsList = ["Blue", "Pink", "Yellow", "Green", "Black", "Beige", "Red", "White"];
  const sizesList = ["XS", "S", "M", "L", "XL", "32"];

  return (
    <aside className="filter-sidebar animate-fade-in">
      <div className="filter-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="filter-group-title">Filters</h3>
          <button 
            onClick={resetFilters} 
            className="btn-outline" 
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Categories</h4>
        <div className="filter-options-grid">
          <button 
            className={`filter-pill ${selectedCategory === "" ? "selected" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`filter-pill ${selectedCategory === cat ? "selected" : ""}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ textTransform: "capitalize" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Sizes</h4>
        <div className="filter-options-grid">
          {sizesList.map((size) => (
            <button 
              key={size} 
              className={`filter-pill ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Colors</h4>
        <div className="filter-options-grid">
          {colorsList.map((color) => {
            // Pick code color
            const code = getColorStyle(color);

            return (
              <button
                key={color}
                className={`filter-color-swatch ${selectedColor === color ? "selected" : ""}`}
                style={{ backgroundColor: code }}
                onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                title={color}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
