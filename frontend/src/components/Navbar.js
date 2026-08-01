import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LuHeart, LuShoppingCart, LuChartLine, LuTrendingUp, LuBell, LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout, cart, wishlist } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/images/trendy-thread-logo.png" alt="Trendy Threads Logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <span>Trendy Threads</span>
        </Link>

        {/* Mobile Toggle Hamburger */}
        <button className="navbar-toggle" onClick={toggleMobileMenu} aria-label="Toggle Navigation Menu">
          &#9776;
        </button>

        {/* Menu Items */}
        <nav className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="navbar-actions">
            
            {/* Wishlist */}
            <Link to="/wishlist" className={`nav-action-item ${isActive('/wishlist')}`} title="Wishlist" onClick={() => setMobileMenuOpen(false)}>
              <div className="nav-icon-container">
                <LuHeart className="nav-icon" />
                {wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}
              </div>
              <span className="nav-label">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className={`nav-action-item ${isActive('/cart')}`} title="Cart" onClick={() => setMobileMenuOpen(false)}>
              <div className="nav-icon-container">
                <LuShoppingCart className="nav-icon" />
                {cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}
              </div>
              <span className="nav-label">Cart</span>
            </Link>

            {/* Expense Tracker */}
            {user && (
              <Link to="/expense-tracker" className={`nav-action-item ${isActive('/expense-tracker')}`} title="Expense Tracker" onClick={() => setMobileMenuOpen(false)}>
                <LuChartLine className="nav-icon" />
                <span className="nav-label">Expenses</span>
              </Link>
            )}

            {/* Shopping Intelligence */}
            {user && (
              <Link to="/shopping-intelligence" className={`nav-action-item ${isActive('/shopping-intelligence')}`} title="Shopping Intelligence" onClick={() => setMobileMenuOpen(false)}>
                <LuTrendingUp className="nav-icon" />
                <span className="nav-label">Insights</span>
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <Link to="/" className="nav-action-item" title="Notifications" onClick={() => setMobileMenuOpen(false)}>
                <div style={{ position: "relative" }}>
                  <LuBell className="nav-icon" />
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#3b82f6', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '50%', padding: '0.1rem 0.3rem', minWidth: '0.9rem', textAlign: 'center' }}>3</span>
                </div>
                <span className="nav-label">Updates</span>
              </Link>
            )}

            {/* Profile / Auth */}
            {user ? (
              <>
                <Link to="/profile" className={`nav-action-item ${isActive('/profile')}`} onClick={() => setMobileMenuOpen(false)}>
                  <LuUser className="nav-icon" />
                  <span className="nav-label">{user.name.split(' ')[0]}</span>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin-dashboard" className={`nav-action-item ${isActive('/admin-dashboard')}`} onClick={() => setMobileMenuOpen(false)}>
                    <LuSettings className="nav-icon" />
                    <span className="nav-label">Admin</span>
                  </Link>
                )}
                <button className="nav-logout-btn" onClick={handleLogoutClick} title="Logout">
                  <LuLogOut className="nav-icon" />
                  <span className="nav-label">Logout</span>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-outline navbar-auth-btn">Login</button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-primary navbar-auth-btn">Signup</button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
