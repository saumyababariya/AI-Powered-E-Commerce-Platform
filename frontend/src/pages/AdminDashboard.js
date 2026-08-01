import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import ProductForm from "../components/ProductForm";
import Navbar from "../components/Navbar";
import { LuPackage, LuUsers, LuShoppingCart, LuSearch, LuPencil, LuTrash2 } from "react-icons/lu";
import "../styles/admin.css";
import { ColorSwatch } from "../utils/colourMapping";

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  
  // CRUD states
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateProductSubmit = (newProduct) => {
    const success = addProduct(newProduct);
    if (success) {
      setActiveTab("manage-products");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveTab("edit-product");
  };

  const handleEditProductSubmit = (updatedProduct) => {
    const success = updateProduct(editingProduct.id, updatedProduct);
    if (success) {
      setEditingProduct(null);
      setActiveTab("manage-products");
    }
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
    }
  };

  // Filter products for the manage table
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(p.id).includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        {/* Sidebar component */}
        <Sidebar 
          type="admin" 
          activeTab={activeTab === "edit-product" ? "manage-products" : activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== "edit-product") {
              setEditingProduct(null); // Clear editing if moving away
            }
          }} 
        />

        {/* Admin Panels */}
        <main className="admin-content animate-fade-in">
          <div className="admin-header">
            <h1>Admin Control Panel</h1>
            <span style={{ color: "var(--light-slate)", fontSize: "0.9rem" }}>
              Welcome back, Administrator
            </span>
          </div>

          {/* Metric Cards showing stats */}
          <section className="metrics-grid">
            <div className="metric-card products">
              <div className="metric-info">
                <span className="metric-label">Total Products</span>
                <span className="metric-value">{products.length}</span>
              </div>
              <span className="metric-icon"><LuPackage /></span>
            </div>

            <div className="metric-card users">
              <div className="metric-info">
                <span className="metric-label">Total Users</span>
                <span className="metric-value">124</span> {/* fake user count */}
              </div>
              <span className="metric-icon"><LuUsers /></span>
            </div>

            <div className="metric-card orders">
              <div className="metric-info">
                <span className="metric-label">Total Orders</span>
                <span className="metric-value">48</span> {/* fake order count */}
              </div>
              <span className="metric-icon"><LuShoppingCart /></span>
            </div>
          </section>

          {/* Active Panel Content */}
          {activeTab === "overview" && (
            <div className="dashboard-section">
              <h2 className="section-header">Dashboard Overview</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p>Welcome to Trendy Threads Admin Dashboard. Use the sidebar to manage catalog inventory, register new styles, or review current items.</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
                  <div style={{ border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>Quick Actions</h3>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                      <button className="btn-primary" onClick={() => setActiveTab("add-product")}>
                        Add New Item
                      </button>
                      <button className="btn-outline" onClick={() => setActiveTab("manage-products")}>
                        View Product Table
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>Inventory Status</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--light-slate)" }}>All systems online. Product listings are cached and persisted locally in the browser's localStorage storage engine.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "add-product" && (
            <div className="dashboard-section">
              <h2 className="section-header">Add New Product</h2>
              <ProductForm 
                onSubmit={handleCreateProductSubmit} 
                submitText="Register Product"
              />
            </div>
          )}

          {activeTab === "edit-product" && (
            <div className="dashboard-section">
              <h2 className="section-header">
                Edit Product ID: {editingProduct?.id}
              </h2>
              <ProductForm 
                onSubmit={handleEditProductSubmit} 
                initialData={editingProduct}
                submitText="Save Changes"
              />
              <button 
                className="btn-outline" 
                style={{ marginTop: "1rem", width: "100%" }}
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab("manage-products");
                }}
              >
                Cancel Edit
              </button>
            </div>
          )}

          {activeTab === "manage-products" && (
            <div className="dashboard-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 className="section-header" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>
                  Manage Products
                </h2>
                
                {/* Product search bar within the dashboard */}
                <div style={{ position: "relative", maxWidth: "300px", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="Search by ID, name, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "0.5rem 2rem 0.5rem 0.75rem", fontSize: "0.85rem" }}
                  />
                  <LuSearch style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", pointerEvents: "none", color: "#999" }} />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="product-crud-table-wrapper">
                  <table className="product-crud-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        // Extract image
                        let imgSrc = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100";
                        if (p.images) {
                          if (typeof p.images === "object" && !Array.isArray(p.images)) {
                            imgSrc = p.images[Object.keys(p.images)[0]];
                          } else if (Array.isArray(p.images)) {
                            imgSrc = p.images[0];
                          } else {
                            imgSrc = p.images;
                          }
                        }

                        return (
                          <tr key={p.id}>
                            <td>
                              <img src={imgSrc} alt={p.name} className="crud-img" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
                            </td>
                            <td style={{ fontWeight: "bold" }}>{p.id}</td>
                            <td>{p.name}</td>
                            <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                            <td>
                              <ColorSwatch colourName={p.color || "Default"} showNameAlways={true} />
                            </td>
                            <td>{p.size || "M"}</td>
                            <td>₹{p.price}</td>
                            <td>{p.discount || 0}%</td>
                            <td>
                              <div className="crud-actions">
                                <button 
                                  className="btn-outline" 
                                  onClick={() => handleEditClick(p)}
                                  title="Edit"
                                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                  <LuPencil /> Edit
                                </button>
                                <button 
                                  className="btn-danger" 
                                  onClick={() => handleDeleteClick(p.id, p.name)}
                                  title="Delete"
                                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                  <LuTrash2 /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--light-slate)" }}>
                  <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>No products matched your criteria.</p>
                  <p style={{ fontSize: "0.9rem" }}>Try adjusting your search query or add a product first.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
