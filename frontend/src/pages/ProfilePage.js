import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { LuUser, LuPackage } from "react-icons/lu";
import "../styles/pages.css";

const ProfilePage = () => {
  const { user, logout, showToast } = useContext(AppContext);
  const navigate = useNavigate();

  // Tab state
  const [activeSubTab, setActiveSubTab] = useState("details");

  // Details Form State
  const [details, setDetails] = useState({
    name: "",
    contactNo: "",
    gender: "",
    email: "",
    address: ""
  });

  // Load user data on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Attempt to load profile details for this specific logged-in email
    const savedProfiles = localStorage.getItem("userProfiles");
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    
    if (profiles[user.email]) {
      setDetails(profiles[user.email]);
    } else {
      // Default filled with username and email
      setDetails({
        name: user.name || "",
        contactNo: "",
        gender: "",
        email: user.email || "",
        address: ""
      });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.email.trim()) {
      showToast("Name and Email are required.", "error");
      return;
    }

    const savedProfiles = localStorage.getItem("userProfiles");
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    profiles[user.email] = details;
    
    localStorage.setItem("userProfiles", JSON.stringify(profiles));
    showToast("Profile details saved successfully!", "success");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <h1 className="page-title" style={{ textAlign: "left" }}>Shopper Dashboard</h1>

        <div className="profile-card">
          {/* Profile Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar-box">
              <img 
                src="/images/profile-icon.png" 
                alt="Avatar" 
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
              />
              <span className="profile-user-name">{user.name}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--light-slate)" }}>{user.email}</span>
            </div>

            <ul className="profile-nav-menu">
              <li>
                <button 
                  className={`profile-nav-link ${activeSubTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("details")}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <LuUser /> Personal Details
                </button>
              </li>
              <li>
                <button 
                  className={`profile-nav-link ${activeSubTab === "history" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("history")}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <LuPackage /> Order History
                </button>
              </li>
              <li>
                <button 
                  className={`profile-nav-link ${activeSubTab === "exchanged" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("exchanged")}
                >
                  🔄 Exchanged Orders
                </button>
              </li>
              <li>
                <button 
                  className={`profile-nav-link ${activeSubTab === "cancelled" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("cancelled")}
                >
                  ❌ Cancelled Orders
                </button>
              </li>
              <li style={{ marginTop: "1rem" }}>
                <button 
                  className="btn-danger" 
                  style={{ width: "100%", padding: "0.5rem" }}
                  onClick={handleLogoutClick}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>

          {/* Profile Main Content */}
          <div className="profile-content-area">
            {activeSubTab === "details" && (
              <div>
                <h3 className="profile-content-header">Personal Details</h3>
                <form onSubmit={handleSaveDetails} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={details.name} 
                      onChange={handleInputChange} 
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input 
                      type="tel" 
                      name="contactNo" 
                      value={details.contactNo} 
                      onChange={handleInputChange} 
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={details.gender} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={details.email} 
                      onChange={handleInputChange} 
                      disabled // Disable editing email as it is primary key for profile
                    />
                  </div>

                  <div className="form-group">
                    <label>Shipping / Billing Address</label>
                    <textarea 
                      name="address" 
                      value={details.address} 
                      onChange={handleInputChange} 
                      placeholder="Type your complete delivery address here..."
                      rows="4"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                    Save Profile Details
                  </button>
                </form>
              </div>
            )}

            {activeSubTab === "history" && (
              <div>
                <h3 className="profile-content-header">Order History</h3>
                <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", marginTop: "1rem" }}>
                  <span style={{ fontSize: "2.5rem" }}><LuPackage /></span>
                  <h4 style={{ margin: "0.75rem 0 0.25rem 0", color: "var(--dark-slate)" }}>No Orders Yet</h4>
                  <p style={{ color: "var(--light-slate)", fontSize: "0.9rem" }}>You haven't placed any purchases yet. Your full transaction list will register here.</p>
                </div>
              </div>
            )}

            {activeSubTab === "exchanged" && (
              <div>
                <h3 className="profile-content-header">Exchanged Orders</h3>
                <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", marginTop: "1rem" }}>
                  <span style={{ fontSize: "2.5rem" }}>🔄</span>
                  <h4 style={{ margin: "0.75rem 0 0.25rem 0", color: "var(--dark-slate)" }}>No Exchanges</h4>
                  <p style={{ color: "var(--light-slate)", fontSize: "0.9rem" }}>You have not requested exchanges for any purchases.</p>
                </div>
              </div>
            )}

            {activeSubTab === "cancelled" && (
              <div>
                <h3 className="profile-content-header">Cancelled Orders</h3>
                <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", marginTop: "1rem" }}>
                  <span style={{ fontSize: "2.5rem" }}>❌</span>
                  <h4 style={{ margin: "0.75rem 0 0.25rem 0", color: "var(--dark-slate)" }}>No Cancelled Orders</h4>
                  <p style={{ color: "var(--light-slate)", fontSize: "0.9rem" }}>You don't have any cancelled invoices or transactions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
