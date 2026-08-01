import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { LuShoppingBag, LuSearch } from "react-icons/lu";
import "../styles/pages.css";

const categoriesData = [
  { name: "top", img: "/images/categories/top.png" },
  { name: "shirt", img: "/images/categories/shirt.png" },
  { name: "jeans", img: "/images/categories/jeans.png" },
  { name: "skirt", img: "/images/categories/skirt.png" },
  { name: "dress", img: "/images/categories/dress.png" },
  { name: "jacket", img: "/images/categories/jacket.png" },
  { name: "kurti", img: "/images/categories/kurti.png" },
];

const colorsList = ["Blue", "Pink", "Yellow", "Green", "Black", "Beige", "Red", "White"];
const sizesList = ["XS", "S", "M", "L", "XL", "32"];

const Home = () => {
  const { products } = useContext(AppContext);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // Get list of unique category names from products
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  // Apply filters
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (selectedCategory && product.category !== selectedCategory) return false;
    // 2. Search Term Filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    // 3. Size Filter
    if (selectedSize) {
      if (product.size) {
        if (product.size !== selectedSize) return false;
      } else return false;
    }
    // 4. Color Filter
    if (selectedColor) {
      if (product.color) {
        if (product.color.toLowerCase() !== selectedColor.toLowerCase()) return false;
      } else if (product.images && typeof product.images === "object" && !Array.isArray(product.images)) {
        if (!Object.keys(product.images).some(c => c.toLowerCase() === selectedColor.toLowerCase())) return false;
      } else return false;
    }
    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discount ? Math.round(a.price * (1 - a.discount / 100)) : a.price;
    const priceB = b.discount ? Math.round(b.price * (1 - b.discount / 100)) : b.price;
    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    return 0; // Default order
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedColor("");
    setSortOption("default");
  };

  return (
    <>
      <Navbar />
      <main className="animate-fade-in" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem" }}>
        
        {/* ROW 2: Search Bar */}
        <div style={{ maxWidth: "1200px", margin: "12px auto 0 auto", padding: "0 1rem" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Search products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #CBD5E1",
                fontSize: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            />
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>🔍</span>
          </div>
        </div>

        {/* ROW 3: Categories */}
        <div style={{ maxWidth: "1200px", margin: "12px auto 0 auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
            <button
              onClick={() => setSelectedCategory("")}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px",
                background: "none", border: "none", cursor: "pointer", opacity: selectedCategory === "" ? 1 : 0.6
              }}
            >
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#2563EB" }}><LuShoppingBag /></div>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", marginTop: "4px" }}>All</span>
            </button>
            {categoriesData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px",
                  background: "none", border: "none", cursor: "pointer", opacity: selectedCategory === cat.name ? 1 : 0.6
                }}
              >
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#F1F5F9", overflow: "hidden", border: selectedCategory === cat.name ? "2px solid #2563EB" : "none" }}>
                  <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", marginTop: "4px", textTransform: "capitalize" }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ROW 4: Filters */}
        <div style={{ maxWidth: "1200px", margin: "12px auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: "white", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
            >
              <option value="default">Sort by: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: selectedSize ? "#DBEAFE" : "white", color: selectedSize ? "#1E40AF" : "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
            >
              <option value="">Size: All</option>
              {sizesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: selectedColor ? "#DBEAFE" : "white", color: selectedColor ? "#1E40AF" : "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
            >
              <option value="">Color: All</option>
              {colorsList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {(searchTerm || selectedCategory || selectedSize || selectedColor || sortOption !== "default") && (
              <button 
                onClick={resetFilters}
                style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #EF4444", backgroundColor: "white", color: "#EF4444", fontSize: "0.85rem", cursor: "pointer", fontWeight: "600" }}
              >
                Clear Filters
              </button>
            )}
            
            <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#64748B", fontWeight: "500" }}>
              {sortedProducts.length} items
            </span>
          </div>
        </div>

        {/* ROW 5: Products */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {sortedProducts.length > 0 ? (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
              gap: "1.5rem",
              alignItems: "stretch"
            }}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 1rem", backgroundColor: "white", borderRadius: "1rem", border: "1px dashed #CBD5E1" }}>
              <span style={{ fontSize: "3rem", color: "#9ca3af" }}><LuSearch /></span>
              <h3 style={{ margin: "1rem 0 0.5rem 0" }}>No Products Found</h3>
              <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>We couldn't find any products matching your search or filters.</p>
              <button onClick={resetFilters} className="btn-primary" style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
