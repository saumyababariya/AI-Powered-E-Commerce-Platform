import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";
import { Outlet, NavLink, useOutletContext } from "react-router-dom";
import { IoArrowBack, IoHome } from "react-icons/io5";
import { MdOutlineInsights, MdOutlineHome, MdFavoriteBorder, MdOutlineShoppingCart, MdOutlinePerson, MdOutlineEmojiEvents, MdOutlineAccountBalanceWallet, MdOutlineTipsAndUpdates, MdQueryStats } from "react-icons/md";

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LuHeart, LuShoppingCart, LuChartLine, LuTrendingUp, LuTrendingDown, LuBrainCircuit, LuBell, LuUser, LuLogOut, LuShoppingBag, LuSearch, LuSettings, LuStar, LuTrophy, LuBot, LuPackage, LuWallet, LuPlus, LuTrash2, LuPencil, LuTriangleAlert, LuTag, LuTimer, LuScale, LuShield, LuArrowRight } from "react-icons/lu";
import "./App.css";
import { getColorInfo, getColorStyle as getMappedColorStyle, ColorSwatch } from "./utils/colourMapping";

const toastRef = { current: null };
const showToast = (message, type) => {
  if (toastRef.current) {
    toastRef.current(message, type);
  } else {
    console.log("Toast message:", message, type);
  }
};

function ToastItem({ toast, onClose }) {
  const getIcon = (type) => {
    if (type === "success") return "✓";
    if (type === "error") return "✕";
    if (type === "warning") return <LuTriangleAlert />;
    return "ℹ";
  };

  return (
    < div className={`toast-item ${toast.type}`} role="alert" aria-live="assertive" >
      < div className="toast-icon" > {getIcon(toast.type)}</div >
      < div className="toast-message" > {toast.message}</div >
      < button className="toast-close-btn" onClick={() => onClose(toast.id)} aria-label="Dismiss notification" >
        ×
      </button >
    </div >
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    < div className="toast-container" >
      {toasts.map((toast) => (
        < ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div >
  );
}


const categories = [
  { name: "top", img: "/images/categories/top.png" },
  { name: "shirt", img: "/images/categories/shirt.png" },
  { name: "jeans", img: "/images/categories/jeans.png" },
  { name: "skirt", img: "/images/categories/skirt.png" },
  { name: "dress", img: "/images/categories/dress.png" },
  { name: "jacket", img: "/images/categories/jacket.png" },
  { name: "kurti", img: "/images/categories/kurti.png" },
];

// Products data with categories and images
// const initialProducts = [
//   {
//     id: 1,
//     name: "Yellow Dress",
//     price: 1399,
//     images: ["/images/yellow-dress.png"],
//     category: "dress",
//     description: "Premium stylish yellow dress with elegant designs, perfect for summer events and casual outings.",
//     sizes: ["XS", "S", "M", "L", "XL"],
//     colours: [{ colour: "Yellow", image: "/images/yellow-dress.png" }]
//   },
//   {
//     id: 2,
//     name: "Shirt",
//     price: 1999,
//     images: { blue: "/images/blue-shirt.png", pink: "/images/pink-shirt.png", yellow: "/images/yellow-shirt.png" },
//     category: "shirt",
//     description: "Modern fitted shirt crafted from premium breathable cotton, offering absolute comfort and timeless style.",
//     sizes: ["XS", "S", "M", "L", "XL"],
//     colours: [
//       { colour: "Blue", image: "/images/blue-shirt.png" },
//       { colour: "Pink", image: "/images/pink-shirt.png" },
//       { colour: "Yellow", image: "/images/yellow-shirt.png" }
//     ]
//   },
//   {
//     id: 3,
//     name: "Green Top",
//     price: 1099,
//     images: ["/images/green-top.png"],
//     category: "top",
//     description: "Casual lightweight green top with contemporary styling, perfect for day-to-day wear.",
//     sizes: ["XS", "S", "M"],
//     colours: [{ colour: "Green", image: "/images/green-top.png" }]
//   },
//   {
//     id: 4,
//     name: "Beige Jacket",
//     price: 1399,
//     images: ["/images/beige-jacket.png"],
//     category: "jacket",
//     description: "Sleek protective beige jacket built for utility and modern urban explorer aesthetics.",
//     sizes: ["M", "L", "XL"],
//     colours: [{ colour: "Beige", image: "/images/beige-jacket.png" }]
//   },
//   {
//     id: 5,
//     name: "Black Dress",
//     price: 1999,
//     images: ["/images/black-dress.png"],
//     category: "dress",
//     description: "Classic elegant black dress. An essential staple for dinner dates and formal cocktail parties.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Black", image: "/images/black-dress.png" }]
//   },
//   {
//     id: 6,
//     name: "Black Skirt",
//     price: 1099,
//     images: ["/images/black-skirt.png"],
//     category: "skirt",
//     description: "Minimalist black skirt, extremely comfortable with excellent fabric stretch properties.",
//     sizes: ["S", "M"],
//     colours: [{ colour: "Black", image: "/images/black-skirt.png" }]
//   },
//   {
//     id: 7,
//     name: "Tank Top",
//     price: 1499,
//     images: ["/images/black-tank-top.png"],
//     category: "top",
//     description: "Active lightweight black tank top, excellent choice for warm seasons or gym exercises.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Black", image: "/images/black-tank-top.png" }]
//   },
//   {
//     id: 8,
//     name: "Blue Cargo",
//     price: 3499,
//     images: ["/images/blue-cargo.png"],
//     category: "jeans",
//     description: "Highly durable multi-pocket blue cargo pants, engineered for active lifestyles.",
//     sizes: ["M", "L", "XL"],
//     colours: [{ colour: "Blue", image: "/images/blue-cargo.png" }]
//   },
//   {
//     id: 9,
//     name: "Denim Jumpsuit",
//     price: 3999,
//     images: ["/images/denim-jumpsuit.png"],
//     category: "jeans",
//     description: "Premium rugged denim jumpsuit. Offers a perfect fitted layout with rugged appeal.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Blue", image: "/images/denim-jumpsuit.png" }]
//   },
//   {
//     id: 10,
//     name: "Kurti",
//     price: 1499,
//     images: ["/images/green-kurti.png"],
//     category: "kurti",
//     description: "Authentic design traditional green kurti with beautiful artistic ethnic patterns.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Green", image: "/images/green-kurti.png" }]
//   },
//   {
//     id: 11,
//     name: "Red Dress",
//     price: 2599,
//     images: ["/images/red-dress.png"],
//     category: "dress",
//     description: "Vibrant high-fashion red dress designed to make an absolute statement.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Red", image: "/images/red-dress.png" }]
//   },
//   {
//     id: 12,
//     name: "Kurti",
//     price: 1299,
//     images: ["/images/pink-kurti.png"],
//     category: "kurti",
//     description: "Soft elegant pink kurti, designed for warm summer seasons and comfort.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Pink", image: "/images/pink-kurti.png" }]
//   },
//   {
//     id: 13,
//     name: "Red kurti",
//     price: 1499,
//     images: ["/images/red-kurti.png"],
//     category: "kurti",
//     description: "Beautiful cotton kurti in deep crimson red with excellent breathability.",
//     sizes: ["M", "L", "XL"],
//     colours: [{ colour: "Red", image: "/images/red-kurti.png" }]
//   },
//   {
//     id: 14,
//     name: "Red top",
//     price: 1099,
//     images: ["/images/red-top.png"],
//     category: "top",
//     description: "Simple yet gorgeous red top with elegant necklines.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Red", image: "/images/red-top.png" }]
//   },
//   {
//     id: 15,
//     name: "skirt",
//     price: 1699,
//     images: ["/images/skirt.png"],
//     category: "skirt",
//     description: "Comfortable dynamic flowing blue skirt with premium fabric weight.",
//     sizes: ["S", "M", "L"],
//     colours: [{ colour: "Blue", image: "/images/skirt.png" }]
//   },
//   {
//     id: 16,
//     name: "White skirt",
//     price: 999,
//     images: ["/images/white-skirt.png"],
//     category: "skirt",
//     description: "Aesthetic white skirt, perfect combination with tops and t-shirts.",
//     sizes: ["XS", "S", "M"],
//     colours: [{ colour: "White", image: "/images/white-skirt.png" }]
//   },
//   {
//     id: 17,
//     name: "Yellow string dress",
//     price: 1499,
//     images: ["/images/yell-dress.png"],
//     category: "dress",
//     description: "Charming yellow string dress, providing absolute breezy comfort.",
//     sizes: ["S", "M"],
//     colours: [{ colour: "Yellow", image: "/images/yell-dress.png" }]
//   },
//   {
//     id: 18,
//     name: "Yellow Kurti",
//     price: 1499,
//     images: ["/images/yellow-kurti.png"],
//     category: "kurti",
//     description: "Bright sunny yellow kurti, excellent choice for festivals and celebrations.",
//     sizes: ["M", "L", "XL"],
//     colours: [{ colour: "Yellow", image: "/images/yellow-kurti.png" }]
//   }
// ];


const sortSizes = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return [];
  const order = ["XS", "S", "M", "L", "XL"];
  return [...sizes].sort((a, b) => order.indexOf(a) - order.indexOf(b));
};

const formatAndSortSizes = (sizesInput) => {
  if (!sizesInput) return "—";
  let arr = [];
  if (Array.isArray(sizesInput)) {
    arr = sizesInput;
  } else if (typeof sizesInput === 'string') {
    arr = sizesInput.split(",").map(s => s.trim());
  } else {
    return String(sizesInput);
  }
  return sortSizes(arr).join(", ");
};

const formatColours = (coloursInput) => {
  if (!coloursInput) return "—";
  let arr = [];
  if (Array.isArray(coloursInput)) {
    arr = coloursInput;
  } else if (typeof coloursInput === 'string') {
    try {
      const parsed = JSON.parse(coloursInput);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      arr = coloursInput.split(",").map(c => c.trim());
    }
  } else {
    return String(coloursInput);
  }

  const names = arr.map(item => {
    if (item && typeof item === 'object') {
      return item.colour || item.color || "";
    }
    return String(item);
  }).filter(Boolean);

  return names.length > 0 ? names.join(", ") : "—";
};

const getColorStyle = (colourName) => {
  return getMappedColorStyle(colourName);
};

const renderPrice = (price, discount, discountType = "PERCENT") => {
  if (!discount || Number(discount) <= 0) {
    return <p className="product-price">₹{price}</p>;
  }
  let finalPrice;
  let discountLabel = "";
  if (discountType === "PERCENT") {
    finalPrice = Math.round(price - (price * Number(discount)) / 100);
    discountLabel = `${discount}% OFF`;
  } else if (discountType === "FLAT") {
    finalPrice = Math.round(price - Number(discount));
    discountLabel = `₹${discount} OFF`;
  } else {
    finalPrice = Math.round(price - (price * Number(discount)) / 100);
    discountLabel = `${discount}% OFF`;
  }
  if (finalPrice < 0) finalPrice = 0;

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center", margin: "4px 0" }}>
      <p className="product-price" style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>₹{price}</p>
      <p className="product-price" style={{ fontWeight: "bold", color: "#2563EB", margin: 0 }}>₹{finalPrice}</p>
      <span style={{ fontSize: "0.8rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.1rem 0.3rem", borderRadius: "0.25rem", fontWeight: "bold" }}>{discountLabel}</span>
    </div>
  );
};

function Wishlist({ wishlist, removeFromWishlist, user, notifications, markNotificationAsRead, addToCart, addToWishlist, cart }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id || 1;
    setLoading(true);
    fetch(`http://localhost:8080/products/recommendations/wishlist/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((item) => {
          const product = item.product ? item.product : item;
          let parsedImages = [];
          try {
            parsedImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
          } catch (e) {
            console.error(e);
          }
          let parsedSizes = [];
          try {
            parsedSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
          } catch (e) {
            console.error(e);
          }
          let parsedColours = [];
          try {
            parsedColours = typeof product.colours === "string" ? JSON.parse(product.colours) : product.colours;
          } catch (e) {
            console.error(e);
          }
          return {
            ...product,
            images: parsedImages || [],
            sizes: parsedSizes || [],
            colours: parsedColours || [],
            brand: product.brand || "",
            stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 0,
            rating: product.rating !== undefined ? product.rating : 0,
            totalReviews: product.totalReviews !== undefined ? product.totalReviews : 0
          };
        });
        setRecommendations(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="wishlist-container">
      <div className="back-arrow" onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center" }}>
        <IoArrowBack style={{ fontSize: "2rem", cursor: "pointer" }} />
      </div>
      <div style={{ height: "0.05rem" }}></div>

      <div className="wishlist-icon-bar" style={{ display: "flex", alignItems: "center", gap: "1cm" }}>
        <Link to="/" className="wishlist-icon" style={{ display: "flex", alignItems: "center" }}><IoHome /></Link>
        <Link to="/cart" className="wishlist-icon"><div className="nav-icon-container"><LuShoppingCart />{cart?.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div></Link>
        <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
      </div>

      <h2 className="section-title">Your Wishlist</h2>

      {wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map((item, i) => {
            let imgSrc;
            if (item.name === "Shirt" && item.color && item.images[item.color.toLowerCase()]) {
              imgSrc = item.images[item.color.toLowerCase()];
            } else if (Array.isArray(item.images)) {
              imgSrc = item.images[0];
            } else {
              imgSrc = item.images;
            }

            return (
              <div key={i} className="wishlist-card">
                <img src={imgSrc} alt={item.name} className="wishlist-img" />
                <h2>{item.name}</h2>
                {item.color && (
                  <p style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Color: <ColorSwatch colourName={item.color} showNameAlways={true} />
                  </p>
                )}
                {item.size && <p style={{ margin: "2px 0" }}>Size: {item.size}</p>}
                {renderPrice(item.price, item.discount, item.discountType)}
                <button onClick={() => removeFromWishlist(i)} className="remove-button">Remove</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem 1.5rem", backgroundColor: "white", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", maxWidth: "500px", margin: "2rem auto" }}>
          <div style={{ fontSize: "5rem", color: "#2563EB", marginBottom: "1rem", animation: "pulse 2s infinite" }}>💙</div>
          <h3 style={{ fontSize: "1.4rem", color: "#2563EB", margin: "0 0 0.5rem 0", fontWeight: "bold" }}>No items in your wishlist.</h3>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Start exploring products and add your favorites.</p>
        </div>
      )}

      {/* Recommended Products Section */}
      <div className="wishlist-recommendations-section">
        <h2 className="section-title" style={{ marginBottom: "2rem", color: "#2563EB" }}>Recommended For You</h2>
        {loading ? (
          <div style={{ textAlign: "center", color: "#2563EB", fontSize: "1.1rem", fontWeight: "bold" }}>
            Curating special recommendations...
          </div>
        ) : recommendations.length > 0 ? (
          <div className="wishlist-recommendations-grid">
            {recommendations.map((product) => {
              const imgSrc = (product.colours && product.colours[0] && product.colours[0].image) ? product.colours[0].image :
                (Array.isArray(product.images) ? product.images[0] : product.image || product.images || "");

              return (
                <div key={product.id} className="wishlist-recommendation-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div>
                    <img src={imgSrc} alt={product.name} className="product-img" style={{ width: "100%", height: "200px", objectFit: "contain", borderRadius: "0.5rem" }} />
                    <h2 className="product-name" style={{ margin: "10px 0 5px 0", fontSize: "1.1rem" }}>{product.name}</h2>
                    {product.brand && (
                      <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", marginBottom: "4px" }}>{product.brand}</div>
                    )}
                    <div style={{ fontSize: "0.8rem", color: "#f59e0b", margin: "3px 0", display: "flex", gap: "0.25rem", justifyContent: "center", alignItems: "center" }}>
                      <span><LuStar fill="#facc15" color="#facc15" /> {product.rating !== undefined ? Number(product.rating).toFixed(1) : "0.0"}</span>
                      <span style={{ color: "#9ca3af" }}>({product.totalReviews || 0})</span>
                    </div>
                    {product.discount ? (() => {
                      let finalPrice;
                      let discountLabel = "";
                      if (product.discountType === "PERCENT") {
                        finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
                        discountLabel = `-${product.discount}%`;
                      } else if (product.discountType === "FLAT") {
                        finalPrice = Math.round(product.price - product.discount);
                        discountLabel = `-₹${product.discount}`;
                      } else {
                        finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
                        discountLabel = `-${product.discount}%`;
                      }
                      if (finalPrice < 0) finalPrice = 0;
                      return (
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center", margin: "4px 0" }}>
                          <p className="product-price" style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>₹{product.price}</p>
                          <p className="product-price" style={{ fontWeight: "bold", color: "#2563EB", margin: 0 }}>₹{finalPrice}</p>
                          <span style={{ fontSize: "0.8rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.1rem 0.3rem", borderRadius: "0.25rem", fontWeight: "bold" }}>{discountLabel}</span>
                        </div>
                      );
                    })() : (
                      <p className="product-price" style={{ margin: "4px 0" }}>₹{product.price}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", width: "100%", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToWishlist(product, product.sizes?.[0] || "M", product.colours?.[0]?.colour || "Default");
                      }}
                      className="confirm-button"
                      style={{ margin: 0, padding: "0.4rem 0.8rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "#2563EB" }}
                    >
                      <LuHeart /> Wishlist
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, product.sizes?.[0] || "M", product.colours?.[0]?.colour || "Default");
                      }}
                      className="confirm-button"
                      style={{ margin: 0, padding: "0.4rem 0.8rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "#10b981" }}
                    >
                      <LuShoppingCart /> +Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
            No recommendations at this time.
          </div>
        )}
      </div>
    </div>
  );
}




function Cart({ cart, removeFromCart, setCart, user, notifications, markNotificationAsRead, wishlist }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const getDiscountedPrice = (item) => {
    if (!item.discount || Number(item.discount) <= 0) return item.price;
    return Math.round(item.price * (1 - Number(item.discount) / 100));
  };
  const total = cart.reduce((acc, item) => acc + getDiscountedPrice(item) * (item.quantity || 1), 0);

  const [budgetAnalysis, setBudgetAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      setLoadingAnalysis(true);
      fetch(`http://localhost:8080/analytics/budget-checkout/${currentUser.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && !data.message) {
            setBudgetAnalysis(data);
          } else {
            setBudgetAnalysis(null);
          }
          setLoadingAnalysis(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAnalysis(false);
        });
    } else {
      setBudgetAnalysis(null);
    }
  }, [cart, currentUser?.id]);

  return (
    <div className="cart-container">
      <div className="cart-nav-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="cart-back" onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center" }}>
          <IoArrowBack style={{ fontSize: "2.2rem", cursor: "pointer" }} />
        </div>
        <div className="cart-icons" style={{ display: "flex", gap: "1cm", alignItems: "center" }}>
          <Link to="/" className="cart-icon" style={{ display: "flex", alignItems: "center" }}><IoHome /></Link>
          <Link to="/wishlist" className="cart-icon"><div className="nav-icon-container"><LuHeart />{wishlist?.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div></Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
        </div>
      </div>

      <h2 className="section-title">Your Cart</h2>

      {cart.map((item, i) => (
        <div key={i} className="cart-item">
          <img
            src={item.images}
            alt={item.name}
            className="cart-img"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-semibold" style={{ margin: "0 0 4px 0" }}>{item.name}</p>
            <p className="text-sm" style={{ margin: "2px 0" }}>Size: {item.size}</p>
            {item.colours && item.colours.length > 0 ? (
              <div style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="text-sm" style={{ fontSize: "0.9rem", color: "#555" }}>Color:</span>
                <ColorSwatch colourName={item.color} showNameAlways={false} />
                <select
                  value={item.color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    const selectedCol = item.colours.find(c => c.colour === newColor);
                    const newImage = selectedCol?.image || "";

                    if (currentUser && currentUser.id) {
                      const payload = {
                        id: item.cartDbId,
                        userId: currentUser.id,
                        productId: item.id,
                        color: newColor,
                        size: item.size,
                        quantity: item.quantity || 1,
                        image: newImage
                      };

                      fetch("http://localhost:8080/cart", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                      })
                        .then(res => {
                          if (!res.ok) throw new Error("Failed to update cart color in database.");
                          return res.json();
                        })
                        .then(dbItem => {
                          const updatedCart = [...cart];
                          updatedCart[i] = { ...item, color: newColor, image: newImage, images: newImage, cartDbId: dbItem.id };
                          setCart(updatedCart);
                        })
                        .catch(err => {
                          console.error(err);
                          showToast(err.message);
                        });
                    } else {
                      const updatedCart = [...cart];
                      updatedCart[i] = { ...item, color: newColor, image: newImage, images: newImage };
                      setCart(updatedCart);
                    }
                  }}
                  style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#fff", fontSize: "0.85rem", cursor: "pointer" }}
                >
                  {item.colours.map((col, idx) => (
                    <option key={idx} value={col.colour}>{col.colour}</option>
                  ))}
                </select>
              </div>
            ) : (
              item.color && (
                <p style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  Color: <ColorSwatch colourName={item.color} showNameAlways={true} />
                </p>
              )
            )}

            {/* Quantity Selector */}
            <div style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="text-sm" style={{ fontSize: "0.9rem", color: "#555" }}>Quantity:</span>
              <select
                value={item.quantity || 1}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value);
                  if (item.stockQuantity !== undefined && newQty > item.stockQuantity) {
                    showToast(`Only ${item.stockQuantity} items available in stock.`);
                    return;
                  }

                  if (currentUser && currentUser.id) {
                    const payload = {
                      id: item.cartDbId,
                      userId: currentUser.id,
                      productId: item.id,
                      color: item.color || "Default",
                      size: item.size || "M",
                      quantity: newQty,
                      image: item.image
                    };

                    fetch("http://localhost:8080/cart", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(payload)
                    })
                      .then(res => {
                        if (!res.ok) throw new Error("Failed to update cart quantity.");
                        return res.json();
                      })
                      .then(dbItem => {
                        const updatedCart = [...cart];
                        updatedCart[i] = { ...item, quantity: newQty, cartDbId: dbItem.id };
                        setCart(updatedCart);
                      })
                      .catch(err => {
                        console.error(err);
                        showToast(err.message);
                      });
                  } else {
                    const updatedCart = [...cart];
                    updatedCart[i] = { ...item, quantity: newQty };
                    setCart(updatedCart);
                  }
                }}
                style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#fff", fontSize: "0.85rem", cursor: "pointer" }}
              >
                {[...Array(Math.max(1, item.stockQuantity !== undefined ? item.stockQuantity : 1)).keys()].map(x => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              {renderPrice(item.price, item.discount, item.discountType)}
            </div>
          </div>
          <button onClick={() => removeFromCart(i)} className="remove-button">Remove</button>
        </div>
      ))}

      {/* Budget Analysis Section */}
      {loadingAnalysis ? (
        <div style={{ margin: "1.5rem 0", color: "#2563EB", fontWeight: "bold", fontSize: "0.95rem", padding: "1rem", backgroundColor: "white", borderRadius: "10px", border: "1px solid #DBEAFE" }}>
          Analyzing budget impacts...
        </div>
      ) : budgetAnalysis ? (
        <div style={{
          margin: "1.5rem 0",
          border: "2px solid #DBEAFE",
          borderRadius: "10px",
          backgroundColor: "#F8FAFC",
          padding: "1.25rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}>
          {budgetAnalysis.exceedsBudget ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", borderBottom: "1px solid #DBEAFE", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.8rem", color: "#EF4444" }}>⚠️</span>
                <div>
                  <h4 style={{ margin: 0, color: "#1E3A8A", fontSize: "1.1rem", fontWeight: "800" }}>Budget Alert</h4>
                  <p style={{ margin: "4px 0 0 0", color: "#DC2626", fontWeight: "700", fontSize: "0.95rem" }}>
                    This purchase exceeds your budget by ₹{budgetAnalysis.overBy.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", backgroundColor: "white", padding: "1rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Current Budget</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", marginTop: "2px" }}>₹{budgetAnalysis.budgetAmount.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Current Spending</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#475569", marginTop: "2px" }}>₹{budgetAnalysis.currentSpent.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Cart Total</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#2563EB", marginTop: "2px" }}>₹{budgetAnalysis.cartTotal.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Projected Spending</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#EF4444", marginTop: "2px" }}>₹{budgetAnalysis.projectedSpend.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "bold", color: "#475569" }}>
                  <span>Projected Budget Consumption</span>
                  <span style={{ color: "#EF4444" }}>{Math.round((budgetAnalysis.projectedSpend / budgetAnalysis.budgetAmount) * 100)}%</span>
                </div>
                <div style={{ height: "10px", backgroundColor: "#E2E8F0", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(100, Math.round((budgetAnalysis.projectedSpend / budgetAnalysis.budgetAmount) * 100))}%`,
                    backgroundColor: "#EF4444",
                    borderRadius: "5px"
                  }} />
                </div>
              </div>

              {/* Suggestions */}
              {budgetAnalysis.suggestions && budgetAnalysis.suggestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px dashed #BFDBFE", paddingTop: "0.75rem" }}>
                  <h5 style={{ margin: 0, color: "#1E3A8A", fontSize: "0.95rem", fontWeight: "800" }}>Suggested products to remove:</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {budgetAnalysis.suggestions.map((sugg, sIdx) => {
                      const cartIdx = cart.findIndex(cItem => cItem.name === sugg.productName);
                      return (
                        <div key={sIdx} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#EFF6FF",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #BFDBFE"
                        }}>
                          <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                            <div style={{ fontSize: "0.9rem", color: "#1E293B", fontWeight: "700" }}>
                              • {sugg.productName} – ₹{sugg.price.toLocaleString("en-IN")}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: "600", marginTop: "2px" }}>
                              Removing this item keeps you within budget.
                            </div>
                          </div>
                          {cartIdx !== -1 && (
                            <button
                              onClick={() => removeFromCart(cartIdx)}
                              style={{
                                padding: "4px 10px",
                                backgroundColor: "#EF4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = "#DC2626"}
                              onMouseLeave={(e) => e.target.style.backgroundColor = "#EF4444"}
                            >
                              Quick Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#1E3A8A", fontWeight: "700", fontSize: "0.95rem" }}>
              <span>✅</span>
              <span>This purchase remains within your budget.</span>
            </div>
          )}
        </div>
      ) : null}

      <p className="total">Total: ₹{total}</p>
      <button onClick={() => navigate("/address")} className="checkout-button">Checkout</button>
    </div>
  );
}

function AddressPage({ cart }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "", // used for label/nickname (e.g. Home, Office)
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false
  });

  // Load addresses for logged in user
  const fetchAddresses = () => {
    if (!currentUser || !currentUser.id) return;
    fetch(`http://localhost:8080/addresses/${currentUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch addresses");
        return res.json();
      })
      .then((data) => {
        setAddresses(data);
        // Preselect default address if available
        const defaultAddr = data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0 && !selectedAddressId) {
          setSelectedAddressId(data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    fetch(`http://localhost:8080/addresses/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete address");
        fetchAddresses();
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      })
      .catch((err) => {
        console.error(err);
        showToast(err.message);
      });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      showToast("Please fill all required fields.");
      return;
    }

    const payload = {
      ...formData,
      userId: currentUser.id
    };

    const url = editingAddress
      ? `http://localhost:8080/addresses/${editingAddress.id}`
      : "http://localhost:8080/addresses";

    const method = editingAddress ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save address");
        return res.json();
      })
      .then((saved) => {
        fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
        // Automatically select the saved address
        setSelectedAddressId(saved.id);
      })
      .catch((err) => {
        console.error(err);
        showToast(err.message);
      });
  };

  const handleProceed = () => {
    if (!selectedAddressId) {
      showToast("Please select or add a delivery address.");
      return;
    }
    const selected = addresses.find((addr) => addr.id === selectedAddressId);
    if (!selected) return;

    // Construct standard localStorage address format compatible with the rest of checkout flow
    const formattedAddress = {
      homeNo: selected.fullName,
      street: `${selected.addressLine1}${selected.addressLine2 ? ', ' + selected.addressLine2 : ''}`,
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
      phone: selected.phone
    };

    localStorage.setItem("shippingAddress", JSON.stringify(formattedAddress));
    navigate("/payment");
  };

  // --- Guest manual fallback flow ---
  const [guestAddress, setGuestAddress] = useState({
    homeNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleGuestChange = (e) => {
    setGuestAddress({ ...guestAddress, [e.target.name]: e.target.value });
  };

  const handleGuestSave = () => {
    if (!guestAddress.homeNo || !guestAddress.street || !guestAddress.city || !guestAddress.state || !guestAddress.pincode || !guestAddress.phone) {
      showToast("Please fill all fields.");
      return;
    }
    localStorage.setItem("shippingAddress", JSON.stringify(guestAddress));
    navigate("/payment");
  };

  if (!currentUser || !currentUser.id) {
    return (
      <div className="address-container" style={{ position: "relative", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "2rem", color: "black" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "2rem", color: "black" }} />
          </Link>
        </div>
        <h2>Enter Delivery Address (Guest)</h2>
        <input type="text" name="homeNo" placeholder="Home No." value={guestAddress.homeNo} onChange={handleGuestChange} />
        <input type="text" name="street" placeholder="Street" value={guestAddress.street} onChange={handleGuestChange} />
        <input type="text" name="city" placeholder="City" value={guestAddress.city} onChange={handleGuestChange} />
        <input type="text" name="state" placeholder="State" value={guestAddress.state} onChange={handleGuestChange} />
        <input type="text" name="pincode" placeholder="Pincode" value={guestAddress.pincode} onChange={handleGuestChange} />
        <input type="tel" name="phone" placeholder="Phone Number" value={guestAddress.phone} onChange={handleGuestChange} />
        <button onClick={handleGuestSave} className="save-address-button">Save Address</button>
      </div>
    );
  }

  return (
    <div className="address-container" style={{ position: "relative", paddingTop: "1rem", maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "2rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "2rem", color: "black" }} />
        </Link>
      </div>

      {!showForm ? (
        <>
          <h2>Select Delivery Address</h2>
          {addresses.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No saved addresses. Please add a new address.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "1rem 0" }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    border: selectedAddressId === addr.id ? "2px solid #2563EB" : "1px solid #ccc",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    style={{ marginTop: "0.25rem", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "1.05rem" }}>
                        {addr.addressLine2 || "Address"}
                      </strong>
                      {addr.isDefault && (
                        <span style={{ fontSize: "0.75rem", backgroundColor: "#DBEAFE", color: "#2563EB", padding: "0.1rem 0.4rem", borderRadius: "9999px", fontWeight: "bold" }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ color: "#333", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                      {addr.fullName} <br />
                      {addr.addressLine1} <br />
                      {addr.city}, {addr.state} - {addr.pincode} <br />
                      Phone: {addr.phone}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                        style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAddNew}
            className="checkout-button"
            style={{ backgroundColor: "#9333ea", width: "100%", marginTop: "0.5rem" }}
          >
            + Add New Address
          </button>

          {addresses.length > 0 && (
            <button onClick={handleProceed} className="proceed-payment-button" style={{ width: "100%" }}>
              Proceed to Payment
            </button>
          )}
        </>
      ) : (
        <>
          <h2>{editingAddress ? "Edit Address" : "Add New Address"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Label / Nickname (e.g. Home, Office)"
              value={formData.addressLine2}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleFormChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Flat/House no., Street, Area"
              value={formData.addressLine1}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleFormChange}
            />

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", cursor: "pointer", margin: "0.5rem 0" }}>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleFormChange}
                style={{ cursor: "pointer" }}
              />
              Set as default address
            </label>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button
                onClick={handleSave}
                className="save-address-button"
                style={{ flex: 1, marginTop: 0 }}
              >
                Save
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingAddress(null); }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "#6b7280",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentSelect = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleNext = () => {
    if (!paymentMethod) {
      showToast("Please select a payment option.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="payment-container" style={{ position: "relative", paddingTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "2rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "2rem", color: "black" }} />
        </Link>
      </div>
      <h2>Select Payment Method</h2>
      <label>
        <input type="radio" name="payment" value="UPI" checked={paymentMethod === "UPI"} onChange={handlePaymentSelect} /> UPI
      </label>
      <label>
        <input type="radio" name="payment" value="Credit Card" checked={paymentMethod === "Credit Card"} onChange={handlePaymentSelect} /> Credit Card
      </label>
      <label>
        <input type="radio" name="payment" value="Netbanking" checked={paymentMethod === "Netbanking"} onChange={handlePaymentSelect} /> Netbanking
      </label>
      <button onClick={handleNext} className="proceed-payment-button">Proceed to Checkout</button>
    </div>
  );
}

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [dbCoupons, setDbCoupons] = useState([]);

  // Rewards state
  const [dnaGrade, setDnaGrade] = useState(null);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [budgetAnalysis, setBudgetAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const getDiscountedPrice = (item) => {
    if (!item.discount || Number(item.discount) <= 0) return item.price;
    let finalPrice;
    if (item.discountType === "PERCENT") {
      finalPrice = Math.round(item.price - (item.price * Number(item.discount)) / 100);
    } else if (item.discountType === "FLAT") {
      finalPrice = Math.round(item.price - Number(item.discount));
    } else {
      finalPrice = Math.round(item.price - (item.price * Number(item.discount)) / 100);
    }
    return finalPrice < 0 ? 0 : finalPrice;
  };

  const total = cart.reduce((acc, item) => acc + getDiscountedPrice(item) * (item.quantity || 1), 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const savings = subtotal - total;
  const shippingFee = total >= 1000 ? 0 : 49;
  const grandTotal = Math.max(0, total - discountAmount + shippingFee);

  const fetchDbCoupons = () => {
    const payload = {
      userId: currentUser?.id ? parseInt(currentUser.id) : null,
      cartTotal: total,
      items: cart.map(item => ({
        productId: item.id,
        category: item.category,
        price: getDiscountedPrice(item),
        quantity: item.quantity || 1
      }))
    };

    fetch("http://localhost:8080/coupons/eligibility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setDbCoupons(data))
      .catch(err => console.error("Error fetching coupons:", err));
  };

  useEffect(() => {
    fetchDbCoupons();
  }, [cart, appliedCoupon, currentUser?.id]);

  const fetchBudgetAnalysis = () => {
    if (currentUser && currentUser.id) {
      setLoadingAnalysis(true);
      fetch(`http://localhost:8080/analytics/budget-checkout/${currentUser.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && !data.message) {
            setBudgetAnalysis(data);
          } else {
            setBudgetAnalysis(null);
          }
          setLoadingAnalysis(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAnalysis(false);
        });
    } else {
      setBudgetAnalysis(null);
    }
  };

  useEffect(() => {
    fetchBudgetAnalysis();
  }, [cart, currentUser?.id]);

  const removeItemByName = (name) => {
    const index = cart.findIndex(item => item.name === name);
    if (index === -1) return;
    const item = cart[index];
    if (item.cartDbId) {
      fetch(`http://localhost:8080/cart/${item.cartDbId}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to remove item.");
          const newCart = [...cart];
          newCart.splice(index, 1);
          setCart(newCart);
        })
        .catch((err) => {
          console.error(err);
          alert(err.message);
        });
    } else {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetch(`http://localhost:8080/analytics/dna-score/${currentUser.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.grade) {
            setDnaGrade(data.grade);
            const rewards = [];
            const add = (code, pct, name) => rewards.push({ code, pct, name });
            const grade = data.grade;
            if (["S", "A", "B", "C", "D"].includes(grade)) add("REWARD-D", 2, "Grade D Milestone");
            if (["S", "A", "B", "C"].includes(grade)) add("REWARD-C", 5, "Grade C Milestone");
            if (["S", "A", "B"].includes(grade)) add("REWARD-B", 10, "Grade B Milestone");
            if (["S", "A"].includes(grade)) add("REWARD-A", 15, "Grade A Milestone");
            if (["S"].includes(grade)) add("REWARD-S", 20, "Ultimate Grade S");
            setUnlockedRewards(rewards);
          }
        })
        .catch(err => console.error("Could not load DNA rewards", err));
    }
  }, []);

  const handleApplyCoupon = async (codeToApply = couponCode) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
    if (!code.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    // Check if it's one of our hardcoded grade rewards
    const rewardMatch = unlockedRewards.find(r => r.code === code.trim().toUpperCase());
    if (rewardMatch) {
      const discount = Math.round((total * rewardMatch.pct) / 100);
      setDiscountAmount(discount);
      setAppliedCoupon(rewardMatch.code);
      setCouponMessage("Reward Coupon Applied Successfully");
      setCouponCode(rewardMatch.code);
      showToast("Coupon Applied Successfully", "success");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code,
          cartTotal: total,
          userId: currentUser?.id ? parseInt(currentUser.id) : null,
          items: cart.map(item => ({
            productId: item.id,
            category: item.category,
            price: getDiscountedPrice(item),
            quantity: item.quantity || 1
          }))
        })
      });
      if (!res.ok) {
        throw new Error("Validation failed");
      }
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(data.discount);
        setAppliedCoupon(data.couponCode);
        setCouponMessage("Coupon Applied Successfully");
        setCouponCode(data.couponCode);
        showToast("Coupon Applied Successfully", "success");
      } else {
        setDiscountAmount(0);
        setAppliedCoupon("");
        setCouponMessage(data.message || "Invalid coupon code");
        showToast("Coupon Not Eligible", "error");
      }
    } catch (err) {
      setDiscountAmount(0);
      setAppliedCoupon("");
      setCouponMessage("Error validating coupon code");
      showToast("Coupon Not Eligible", "error");
    }
  };

  const handleRemoveAppliedCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon("");
    setCouponCode("");
    setCouponMessage("");
    showToast("Coupon Removed", "info");
  };

  const confirmOrder = async () => {
    const orderItems = cart.map(item => {
      const priceVal = parseFloat(item.price) || 0;
      const discountVal = parseFloat(item.discount) || 0;
      let finalPriceVal;
      if (item.discountType === "PERCENT") {
        finalPriceVal = priceVal - (priceVal * discountVal / 100);
      } else if (item.discountType === "FLAT") {
        finalPriceVal = priceVal - discountVal;
      } else {
        finalPriceVal = priceVal - (priceVal * discountVal / 100);
      }
      if (finalPriceVal < 0) finalPriceVal = 0;
      const resolvedImage = item.image || (Array.isArray(item.images) ? item.images[0] : item.images) || "";

      return {
        productId: parseInt(item.id) || 0,
        name: item.name || "Product",
        images: resolvedImage,
        size: item.size || "M",
        color: item.color || "Default",
        quantity: parseInt(item.quantity) || 1,
        price: priceVal,
        discount: discountVal,
        finalPrice: parseFloat(finalPriceVal) || 0
      };
    });

    const orderData = {
      userId: currentUser?.id ? parseInt(currentUser.id) : null,
      totalAmount: parseFloat(grandTotal) || 0,
      status: "Preparing Your Order",
      items: orderItems,
      couponCode: appliedCoupon || null,
      couponDiscount: discountAmount || 0.0
    };

    try {
      const res = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error("Failed to place order.");

      const promises = cart.map(item => {
        if (item.cartDbId) {
          return fetch(`http://localhost:8080/cart/${item.cartDbId}`, {
            method: "DELETE"
          }).catch(err => console.error(err));
        }
        return Promise.resolve();
      });
      await Promise.all(promises);

      setCart([]);
      navigate("/order-confirmed");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm order: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1.5rem", border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "white" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Checkout</h2>

      {cart.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
          <img src={item.image || (Array.isArray(item.images) ? item.images[0] : item.images) || "/placeholder.jpg"} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.name}</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Size: {item.size || "M"} | Color: {item.color || "Default"} | Qty: {item.quantity || 1}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "bold", marginTop: "0.25rem" }}>₹{getDiscountedPrice(item)}</div>
          </div>
        </div>
      ))}

      {unlockedRewards.length > 0 && (
        <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", padding: "1rem", margin: "1.5rem 0", border: "1px solid #bfdbfe" }}>
          <h3 style={{ color: "#1d4ed8", fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🎁</span> Reward Coupons Available
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {unlockedRewards.map((reward, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "0.75rem", borderRadius: "6px", border: "1px dashed #93c5fd" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#1e40af", fontSize: "0.95rem" }}>{reward.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>Code: <strong style={{ color: "#2563EB" }}>{reward.code}</strong> • {reward.pct}% OFF</div>
                </div>
                <button
                  onClick={() => handleApplyCoupon(reward.code)}
                  style={{ padding: "0.4rem 0.8rem", backgroundColor: appliedCoupon === reward.code ? "#10b981" : "#2563EB", color: "white", border: "none", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", cursor: "pointer" }}
                >
                  {appliedCoupon === reward.code ? "Applied" : "Apply"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Coupons Section */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "1rem", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🏷️</span> Available Coupons
        </h3>
        
        {dbCoupons.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No coupons available at the moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            {dbCoupons.map((coupon) => {
              const isEligible = coupon.eligible;
              const isApplied = appliedCoupon === coupon.code;
              const cardBg = isEligible ? "#f0fdf4" : "#f8fafc";
              const cardBorder = isApplied ? "2px solid #10b981" : (isEligible ? "1px solid #bbf7d0" : "1px solid #e2e8f0");
              const badgeBg = isEligible ? "#d1fae5" : "#e2e8f0";
              const badgeColor = isEligible ? "#065f46" : "#475569";
              const discountLabel = coupon.discountType === "PERCENT" ? `${Math.round(coupon.discountValue)}% OFF` : `₹${Math.round(coupon.discountValue)} OFF`;

              return (
                <div 
                  key={coupon.id} 
                  style={{
                    backgroundColor: cardBg,
                    border: cardBorder,
                    borderRadius: "8px",
                    padding: "1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    position: "relative",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: "800", fontSize: "1.05rem", letterSpacing: "0.5px", color: isEligible ? "#047857" : "#475569", backgroundColor: isEligible ? "#d1fae5" : "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px", border: isEligible ? "1px dashed #34d399" : "1px dashed #cbd5e1" }}>
                        {coupon.code}
                      </span>
                      <span style={{ fontSize: "0.75rem", backgroundColor: badgeBg, color: badgeColor, padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: "bold" }}>
                        {discountLabel}
                      </span>
                    </div>
                    
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: isEligible ? "#16a34a" : "#dc2626" }}>
                      {isEligible ? "✅ Eligible" : "❌ Not Eligible"}
                    </span>
                  </div>

                  <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#1e293b", fontWeight: "500" }}>
                    {coupon.description}
                  </p>

                  <div style={{ fontSize: "0.8rem", color: isEligible ? "#047857" : "#64748b", marginTop: "2px" }}>
                    <strong>Requirements:</strong> {coupon.requirements}
                    {!isEligible && (
                      <div style={{ color: "#ef4444", fontWeight: "600", marginTop: "4px" }}>
                        Reason: {coupon.reason}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
                    {isApplied ? (
                      <button
                        type="button"
                        onClick={handleRemoveAppliedCoupon}
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          border: "1px solid #ef4444",
                          backgroundColor: "#fef2f2",
                          color: "#b91c1c",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Remove Coupon
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (!isEligible) {
                            showToast("Coupon Not Eligible", "error");
                            return;
                          }
                          handleApplyCoupon(coupon.code);
                        }}
                        disabled={!isEligible}
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: isEligible ? "#10b981" : "#cbd5e1",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          cursor: isEligible ? "pointer" : "not-allowed"
                        }}
                      >
                        Apply Coupon
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: 0 }}>Have a coupon?</h3>
          {appliedCoupon && (
            <button
              onClick={handleRemoveAppliedCoupon}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", padding: 0 }}
            >
              Remove Applied Coupon
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Enter Coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => handleApplyCoupon(couponCode)}
              style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#2563EB", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "0.9rem" }}
            >
              Apply Coupon
            </button>
          </div>
          {couponMessage && (
            <div style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              color: couponMessage.includes("Successfully") ? "#10b981" : "#ef4444"
            }}>
              {couponMessage}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
          <span>Items Total</span>
          <span>₹{subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#2563EB" }}>
          <span>Savings</span>
          <span>- ₹{savings}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#10b981" }}>
          <span>Coupon Discount</span>
          <span>- ₹{discountAmount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
          <span>Shipping Fee</span>
          <span style={{ color: shippingFee === 0 ? "#10b981" : "inherit", fontWeight: "bold" }}>
            {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
          <span>Estimated Delivery</span>
          <span style={{ fontWeight: "bold", color: "#4b5563" }}>
            {(() => {
              const d = new Date();
              d.setDate(d.getDate() + 5);
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
            })()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", borderTop: "1px dashed #ccc", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Budget Analysis Section */}
      {loadingAnalysis ? (
        <div style={{ margin: "1.5rem 0", color: "#2563EB", fontWeight: "bold", fontSize: "0.95rem", padding: "1rem", backgroundColor: "white", borderRadius: "10px", border: "1px solid #DBEAFE" }}>
          Analyzing budget impacts...
        </div>
      ) : budgetAnalysis ? (
        <div style={{
          margin: "1.5rem 0",
          border: "2px solid #DBEAFE",
          borderRadius: "10px",
          backgroundColor: "#F8FAFC",
          padding: "1.25rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}>
          {budgetAnalysis.exceedsBudget ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", borderBottom: "1px solid #DBEAFE", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.8rem", color: "#EF4444" }}>⚠️</span>
                <div>
                  <h4 style={{ margin: 0, color: "#1E3A8A", fontSize: "1.1rem", fontWeight: "800" }}>Budget Alert</h4>
                  <p style={{ margin: "4px 0 0 0", color: "#DC2626", fontWeight: "700", fontSize: "0.95rem" }}>
                    This purchase exceeds your budget by ₹{budgetAnalysis.overBy.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", backgroundColor: "white", padding: "1rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Current Budget</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", marginTop: "2px" }}>₹{budgetAnalysis.budgetAmount.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Current Spending</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#475569", marginTop: "2px" }}>₹{budgetAnalysis.currentSpent.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Cart Total</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#2563EB", marginTop: "2px" }}>₹{budgetAnalysis.cartTotal.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Projected Spending</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#EF4444", marginTop: "2px" }}>₹{budgetAnalysis.projectedSpend.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "bold", color: "#475569" }}>
                  <span>Projected Budget Consumption</span>
                  <span style={{ color: "#EF4444" }}>{Math.round((budgetAnalysis.projectedSpend / budgetAnalysis.budgetAmount) * 100)}%</span>
                </div>
                <div style={{ height: "10px", backgroundColor: "#E2E8F0", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(100, Math.round((budgetAnalysis.projectedSpend / budgetAnalysis.budgetAmount) * 100))}%`,
                    backgroundColor: "#EF4444",
                    borderRadius: "5px"
                  }} />
                </div>
              </div>

              {/* Suggestions */}
              {budgetAnalysis.suggestions && budgetAnalysis.suggestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px dashed #BFDBFE", paddingTop: "0.75rem" }}>
                  <h5 style={{ margin: 0, color: "#1E3A8A", fontSize: "0.95rem", fontWeight: "800" }}>Suggested products to remove:</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {budgetAnalysis.suggestions.map((sugg, sIdx) => (
                      <div key={sIdx} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#EFF6FF",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #BFDBFE"
                      }}>
                        <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                          <div style={{ fontSize: "0.9rem", color: "#1E293B", fontWeight: "700" }}>
                            • {sugg.productName} – ₹{sugg.price.toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: "600", marginTop: "2px" }}>
                            Removing this item keeps you within budget.
                          </div>
                        </div>
                        <button
                          onClick={() => removeItemByName(sugg.productName)}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#DC2626"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "#EF4444"}
                        >
                          Quick Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#1E3A8A", fontWeight: "700", fontSize: "0.95rem" }}>
              <span>✅</span>
              <span>This purchase remains within your budget.</span>
            </div>
          )}
        </div>
      ) : null}

      <button onClick={confirmOrder} className="confirm-button">
        Confirm & Place Order (₹{grandTotal})
      </button>
    </div>
  );
}
function OrderPlaced() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="order-confirmed" style={{ position: "relative", paddingTop: "1rem", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "2rem" }}>
        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "2rem", color: "black" }} />
        </div>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "2rem", color: "black" }} />
        </Link>
      </div>
      <h3 style={{ color: "#10b981", margin: "1rem 0" }}>Order Placed Successfully</h3>
      <div style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "1.5rem 0" }}>
        Estimated Delivery: {(() => {
          const d = new Date();
          d.setDate(d.getDate() + 5);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        })()}
      </div>
      <div style={{ color: "#666", fontSize: "0.95rem" }}>You will be redirected to the homepage shortly.</div>
    </div>
  );
}

function Home({ user, handleLogout, products, notifications, markNotificationAsRead, cart, wishlist }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [displayedProducts, setDisplayedProducts] = useState(products);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubCategory("");
  };

  const getAvailableSubCategories = () => {
    if (!selectedCategory) return [];
    const lowerCategory = selectedCategory.toLowerCase();
    const categoryProducts = products.filter((product) => {
      if (!product.category) return false;
      const prodCat = product.category.toLowerCase();
      if (lowerCategory === "fashion") {
        return ["dress", "top", "shirt", "jacket", "jeans", "kurti", "skirt", "fashion"].includes(prodCat);
      }
      return prodCat === lowerCategory;
    });
    const subcats = new Set();
    categoryProducts.forEach((p) => {
      if (p.subCategory && p.subCategory.trim() !== "") {
        subcats.add(p.subCategory.trim());
      }
    });
    return Array.from(subcats).sort();
  };

  useEffect(() => {
    // Fetch sorted/filtered base products from backend based on sorting selection
    fetch(`http://localhost:8080/products/sort?sortBy=${sortBy}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sorted products");
        return res.json();
      })
      .then((data) => {
        // Parse JSON fields (images, sizes, colours) into proper javascript formats
        let formatted = data.map((product) => {
          let parsedImages = [];
          try {
            parsedImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
          } catch (e) {
            console.error(e);
          }
          let parsedSizes = [];
          try {
            parsedSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
          } catch (e) {
            console.error(e);
          }
          let parsedColours = [];
          try {
            parsedColours = typeof product.colours === "string" ? JSON.parse(product.colours) : product.colours;
          } catch (e) {
            console.error(e);
          }
          return {
            ...product,
            images: parsedImages || [],
            sizes: parsedSizes || [],
            colours: parsedColours || [],
            brand: product.brand || "",
            stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 0,
            sku: product.sku || "",
            specifications: product.specifications || "",
            warranty: product.warranty || "",
            seller: product.seller || "",
            salesCount: product.salesCount !== undefined ? product.salesCount : 0,
            rating: product.rating !== undefined ? product.rating : 0,
            totalReviews: product.totalReviews !== undefined ? product.totalReviews : 0
          };
        });

        // Apply active search query on the frontend
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          formatted = formatted.filter((product) =>
            (product.name && product.name.toLowerCase().includes(q)) ||
            (product.category && product.category.toLowerCase().includes(q)) ||
            (product.description && product.description.toLowerCase().includes(q))
          );
        }

        // Apply active category filter
        if (selectedCategory) {
          if (selectedCategory.toLowerCase() === "fashion") {
            formatted = formatted.filter((product) =>
              ["dress", "top", "shirt", "jacket", "jeans", "kurti", "skirt", "fashion"].includes(product.category.toLowerCase())
            );
          } else {
            formatted = formatted.filter((product) =>
              product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
          }
        }

        // Apply active subcategory filter
        if (selectedCategory && selectedSubCategory) {
          formatted = formatted.filter((product) =>
            product.subCategory && product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
          );
        }

        // Apply active size filter
        if (selectedSize) {
          formatted = formatted.filter((product) => {
            if (!product.sizes) return false;
            return product.sizes.some(s => {
              const sVal = typeof s === 'object' && s !== null ? s.size : s;
              return String(sVal).toLowerCase() === selectedSize.toLowerCase();
            });
          });
        }

        // Apply active colour filter
        if (selectedColour) {
          formatted = formatted.filter((product) => {
            if (!product.colours) return false;
            return product.colours.some(c => {
              const cVal = typeof c === 'object' && c !== null ? c.colour : c;
              return String(cVal).toLowerCase() === selectedColour.toLowerCase();
            });
          });
        }

        // Apply active min price filter
        if (minPrice) {
          const min = parseFloat(minPrice);
          if (!isNaN(min)) {
            formatted = formatted.filter((product) => product.price >= min);
          }
        }

        // Apply active max price filter
        if (maxPrice) {
          const max = parseFloat(maxPrice);
          if (!isNaN(max)) {
            formatted = formatted.filter((product) => product.price <= max);
          }
        }

        setDisplayedProducts(formatted);
      })
      .catch((err) => console.error("Error fetching sorted products:", err));
  }, [searchQuery, selectedSize, selectedColour, minPrice, maxPrice, selectedCategory, selectedSubCategory, products, sortBy]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:8080/recently-viewed/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch recently viewed products");
          return res.json();
        })
        .then((data) => {
          let formatted = data.map((item) => {
            const product = item.product ? item.product : item;
            let parsedImages = [];
            try {
              parsedImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
            } catch (e) {
              console.error(e);
            }
            let parsedSizes = [];
            try {
              parsedSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
            } catch (e) {
              console.error(e);
            }
            let parsedColours = [];
            try {
              parsedColours = typeof product.colours === "string" ? JSON.parse(product.colours) : product.colours;
            } catch (e) {
              console.error(e);
            }
            return {
              ...product,
              images: parsedImages || [],
              sizes: parsedSizes || [],
              colours: parsedColours || [],
              brand: product.brand || "",
              stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 0,
              sku: product.sku || "",
              specifications: product.specifications || "",
              warranty: product.warranty || "",
              seller: product.seller || "",
              salesCount: product.salesCount !== undefined ? product.salesCount : 0,
              rating: product.rating !== undefined ? product.rating : 0,
              totalReviews: product.totalReviews !== undefined ? product.totalReviews : 0
            };
          });
          setRecentlyViewed(formatted.slice(0, 10));
        })
        .catch((err) => console.error("Error fetching recently viewed:", err));
    } else {
      setRecentlyViewed([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:8080/products/recommended/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch recommended products");
          return res.json();
        })
        .then((data) => {
          let formatted = data.map((item) => {
            const product = item.product ? item.product : item;
            let parsedImages = [];
            try {
              parsedImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
            } catch (e) {
              console.error(e);
            }
            let parsedSizes = [];
            try {
              parsedSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
            } catch (e) {
              console.error(e);
            }
            let parsedColours = [];
            try {
              parsedColours = typeof product.colours === "string" ? JSON.parse(product.colours) : product.colours;
            } catch (e) {
              console.error(e);
            }
            return {
              ...product,
              images: parsedImages || [],
              sizes: parsedSizes || [],
              colours: parsedColours || [],
              brand: product.brand || "",
              stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 0,
              sku: product.sku || "",
              specifications: product.specifications || "",
              warranty: product.warranty || "",
              seller: product.seller || "",
              salesCount: product.salesCount !== undefined ? product.salesCount : 0,
              rating: product.rating !== undefined ? product.rating : 0,
              totalReviews: product.totalReviews !== undefined ? product.totalReviews : 0
            };
          });
          setRecommendedProducts(formatted);
        })
        .catch((err) => console.error("Error fetching recommended products:", err));
    } else {
      setRecommendedProducts([]);
    }
  }, [user]);

  const renderProductGrid = (productsList) => {
    return (
      <div className="product-grid">
        {productsList.map((product) => {
          const imgSrc = (product.colours && product.colours[0] && product.colours[0].image) ? product.colours[0].image :
            (Array.isArray(product.images) ? product.images[0] : product.image || product.images || "");

          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card" style={{ textDecoration: "none" }}>
              <img
                src={imgSrc}
                alt={product.name}
                className="product-img"
              />
              <h2 className="product-name">{product.name}</h2>
              {product.brand && (
                <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", marginTop: "2px" }}>{product.brand}</div>
              )}
              <div style={{ fontSize: "0.8rem", color: "#f59e0b", margin: "3px 0", display: "flex", gap: "0.25rem", justifyContent: "center", alignItems: "center" }}>
                <span><LuStar fill="#facc15" color="#facc15" /> {product.rating !== undefined ? Number(product.rating).toFixed(1) : "0.0"}</span>
                <span style={{ color: "#9ca3af" }}>({product.totalReviews || 0})</span>
              </div>
              <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                {product.stockQuantity === 0 ? (
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>Out of Stock</span>
                ) : product.stockQuantity <= 10 ? (
                  <span style={{ color: "#d97706", fontWeight: "bold" }}>Only {product.stockQuantity} left</span>
                ) : (
                  <span style={{ color: "#059669", fontWeight: "bold" }}>In Stock</span>
                )}
              </div>
              {product.discount ? (() => {
                let finalPrice;
                let discountLabel = "";
                if (product.discountType === "PERCENT") {
                  finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
                  discountLabel = `-${product.discount}%`;
                } else if (product.discountType === "FLAT") {
                  finalPrice = Math.round(product.price - product.discount);
                  discountLabel = `-₹${product.discount}`;
                } else {
                  finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
                  discountLabel = `-${product.discount}%`;
                }
                if (finalPrice < 0) finalPrice = 0;
                return (
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center", margin: "4px 0" }}>
                    <p className="product-price" style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.9rem" }}>₹{product.price}</p>
                    <p className="product-price" style={{ fontWeight: "bold", color: "#2563EB" }}>₹{finalPrice}</p>
                    <span style={{ fontSize: "0.8rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.1rem 0.3rem", borderRadius: "0.25rem", fontWeight: "bold" }}>{discountLabel}</span>
                  </div>
                );
              })() : (
                <p className="product-price">₹{product.price}</p>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="home" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", margin: 0, padding: 0 }}>
      {/* ROW 1: Sticky Navbar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: "1px solid #E2E8F0",
        height: "65px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/images/trendy-thread-logo.png" alt="Logo" style={{ height: "36px", width: "auto", objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#2563EB", whiteSpace: "nowrap" }}>Trendy Threads</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", height: "100%" }}>
          {user && user.role === "admin" && (
            <Link to="/admin-dashboard" className="nav-action-item">
              <span className="nav-label" style={{ color: "#2563EB", textTransform: "uppercase" }}>Admin</span>
            </Link>
          )}
          <Link to="/wishlist" className="nav-action-item">
            <LuHeart className="nav-icon" />
            <span className="nav-label">Wishlist</span>
          </Link>
          <Link to="/cart" className="nav-action-item">
            <LuShoppingCart className="nav-icon" />
            <span className="nav-label">Cart</span>
          </Link>
          {user && (
            <>
              <Link to="/expense-tracker" className="nav-action-item">
                <LuChartLine className="nav-icon" />
                <span className="nav-label">Expenses</span>
              </Link>
              <Link to="/shopping-intelligence" className="nav-action-item">
                <LuTrendingUp className="nav-icon" />
                <span className="nav-label">Insights</span>
              </Link>
            </>
          )}
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          {user ? (
            <>
              <Link to="/profile" className="nav-action-item">
                <LuUser className="nav-icon" />
                <span className="nav-label">Profile</span>
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn">
                <LuLogOut className="nav-icon" />
                <span className="nav-label">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-action-item">
              <LuUser className="nav-icon" />
              <span className="nav-label">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* ROW 2: Search Bar */}
      <div style={{ maxWidth: "1200px", margin: "12px auto 0 auto", padding: "0 1rem" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1.2rem 0.75rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #CBD5E1",
              fontSize: "1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              boxSizing: "border-box",
              outline: "none"
            }}
          />
          <LuSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: "1.25rem" }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#999" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ROW 3: Categories */}
      <div style={{ maxWidth: "1200px", margin: "12px auto 0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { name: "Fashion", label: "Fashion", color: "#2563EB" },
            { name: "Electronics", label: "Electronics", color: "#2563eb" },
            { name: "Books", label: "Books", color: "#d97706" },
            { name: "Beauty", label: "Beauty", color: "#7c3aed" },
            { name: "Home & Kitchen", label: "Home & Kitchen", color: "#0d9488" },
            { name: "Sports", label: "Sports", color: "#4f46e5" },
            { name: "Accessories", label: "Accessories", color: "#e11d48" }
          ].map((cat) => {
            const isSelected = selectedCategory && (selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              (cat.name === "Fashion" && ["dress", "top", "shirt", "jacket", "jeans", "kurti", "skirt", "fashion"].includes(selectedCategory.toLowerCase())));
            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategory(null);
                    setSelectedSubCategory("");
                  } else {
                    setSelectedCategory(cat.name.toLowerCase());
                    setSelectedSubCategory("");
                  }
                }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  border: isSelected ? `2px solid ${cat.color}` : "1px solid #CBD5E1",
                  backgroundColor: isSelected ? cat.color : "white",
                  color: isSelected ? "white" : "#4b5563",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ROW 4: Filters */}
      <div style={{ maxWidth: "1200px", margin: "12px auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: selectedSize ? "#DBEAFE" : "white", color: selectedSize ? "#1E40AF" : "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
          >
            <option value="">Size: All</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="32">32</option>
          </select>

          <select
            value={selectedColour}
            onChange={(e) => setSelectedColour(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: selectedColour ? "#DBEAFE" : "white", color: selectedColour ? "#1E40AF" : "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
          >
            <option value="">Colour: All</option>
            <option value="Pink">Pink</option>
            <option value="Black">Black</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Blue">Blue</option>
            <option value="Red">Red</option>
            <option value="Beige">Beige</option>
            <option value="White">White</option>
          </select>

          {selectedCategory && getAvailableSubCategories().length > 0 && (
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: selectedSubCategory ? "#DBEAFE" : "white", color: selectedSubCategory ? "#1E40AF" : "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
            >
              <option value="">SubCat: All</option>
              {getAvailableSubCategories().map((subCat) => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", backgroundColor: "white", fontSize: "0.85rem", cursor: "pointer", fontWeight: "500" }}
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="discounted">Discounted</option>
          </select>

          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", fontSize: "0.85rem", width: "80px" }}
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #CBD5E1", fontSize: "0.85rem", width: "80px" }}
          />

          {(selectedSize || selectedColour || minPrice || maxPrice || selectedCategory || selectedSubCategory || sortBy !== "recommended" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSize("");
                setSelectedColour("");
                setMinPrice("");
                setMaxPrice("");
                setSelectedCategory(null);
                setSelectedSubCategory("");
                setSearchQuery("");
                setSortBy("recommended");
              }}
              style={{ padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #EF4444", backgroundColor: "white", color: "#EF4444", fontSize: "0.85rem", cursor: "pointer", fontWeight: "600" }}
            >
              Clear Filters
            </button>
          )}

        </div>
      </div>

      {(() => {
        const hasActiveFilters = !!(selectedSize || selectedColour || minPrice || maxPrice || selectedCategory || searchQuery.trim() !== "" || sortBy !== "recommended");
        if (hasActiveFilters) {
          return (
            <div>
              <h2 style={{ fontSize: "1.8rem", color: "#2563EB", margin: "2rem 0 1rem 0", textAlign: "center", fontWeight: "bold" }}>Search & Filter Results</h2>
              {displayedProducts.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666", fontSize: "1.1rem", margin: "2rem 0" }}>No products matched your criteria.</p>
              ) : (
                renderProductGrid(displayedProducts)
              )}
            </div>
          );
        } else {
          return (
            <div>
              {/* Recently Viewed Section */}
              {user && recentlyViewed.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#2563EB", fontWeight: "bold", borderBottom: "2px solid #DBEAFE", display: "inline-block", paddingBottom: "5px" }}>
                      Recently Viewed
                    </h2>
                  </div>
                  {renderProductGrid(recentlyViewed)}
                </div>
              )}

              {/* Recommended For You Section */}
              {user && recommendedProducts.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#2563EB", fontWeight: "bold", borderBottom: "2px solid #DBEAFE", display: "inline-block", paddingBottom: "5px" }}>
                      Recommended For You
                    </h2>
                  </div>
                  {renderProductGrid(recommendedProducts)}
                </div>
              )}

              {/* Top Rated Section */}
              {displayedProducts.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#2563EB", fontWeight: "bold", borderBottom: "2px solid #DBEAFE", display: "inline-block", paddingBottom: "5px" }}>
                      Top Rated Products
                    </h2>
                  </div>
                  {renderProductGrid([...displayedProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8))}
                </div>
              )}

              {/* Best Sellers Section */}
              {displayedProducts.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#2563EB", fontWeight: "bold", borderBottom: "2px solid #DBEAFE", display: "inline-block", paddingBottom: "5px" }}>
                      Best Sellers
                    </h2>
                  </div>
                  {renderProductGrid([...displayedProducts].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 8))}
                </div>
              )}

              {/* New Arrivals Section */}
              {displayedProducts.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#2563EB", fontWeight: "bold", borderBottom: "2px solid #DBEAFE", display: "inline-block", paddingBottom: "5px" }}>
                      New Arrivals
                    </h2>
                  </div>
                  {renderProductGrid([...displayedProducts].sort((a, b) => b.id - a.id).slice(0, 8))}
                </div>
              )}
            </div>
          );
        }
      })()}
    </div>
  );
}

function ProductPage({ addToCart, addToWishlist, products, fetchProducts, user, notifications, markNotificationAsRead, cart, wishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  // Determine initial color
  const colorMap = product?.colours || [];
  const initialColor = colorMap.length > 0 ? colorMap[0].colour : (product?.id === 2 ? "Blue" : null);

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(initialColor);
  const [colorSelectedManually, setColorSelectedManually] = useState(false);
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const renderStars = (ratingVal) => {
    const rounded = Math.round(ratingVal || 0);
    let starsStr = "";
    for (let i = 1; i <= 5; i++) {
      starsStr += i <= rounded ? "★" : "☆";
    }
    return starsStr;
  };

  const fetchReviews = () => {
    fetch(`http://localhost:8080/reviews/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  };

  const fetchRelatedProducts = () => {
    fetch(`http://localhost:8080/products/related/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch related products");
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((p) => {
          let parsedImages = [];
          try {
            parsedImages = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
          } catch (e) {
            console.error(e);
          }
          let parsedSizes = [];
          try {
            parsedSizes = typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes;
          } catch (e) {
            console.error(e);
          }
          let parsedColours = [];
          try {
            parsedColours = typeof p.colours === "string" ? JSON.parse(p.colours) : p.colours;
          } catch (e) {
            console.error(e);
          }
          return {
            ...p,
            images: parsedImages || [],
            sizes: parsedSizes || [],
            colours: parsedColours || [],
            brand: p.brand || "",
            stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 0,
            sku: p.sku || "",
            specifications: p.specifications || "",
            warranty: p.warranty || "",
            seller: p.seller || "",
            salesCount: p.salesCount !== undefined ? p.salesCount : 0,
            rating: p.rating !== undefined ? p.rating : 0,
            totalReviews: p.totalReviews !== undefined ? p.totalReviews : 0,
            subCategory: p.subCategory || ""
          };
        });
        setRelatedProducts(formatted);
      })
      .catch((err) => console.error("Error fetching related products:", err));
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (fetchProducts) fetchProducts();
    fetchReviews();
    fetchRelatedProducts();

    // Log the recently viewed product if the user is logged in
    const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (userFromStorage && userFromStorage.id) {
      fetch("http://localhost:8080/recently-viewed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userFromStorage.id,
          productId: parseInt(id)
        })
      })
        .then((res) => {
          if (!res.ok) console.error("Failed to submit recently viewed product");
        })
        .catch((err) => console.error("Error submitting recently viewed product:", err));
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const colorMap = product.colours || [];
      const initialColor = colorMap.length > 0 ? colorMap[0].colour : (product.id === 2 ? "Blue" : null);
      setSize(null);
      setColor(initialColor);
      setColorSelectedManually(false);
      setMessage("");
    }
  }, [id, product]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newRating || newRating <= 0) {
      showToast("Please select a valid rating.");
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!currentUser || !currentUser.id) {
      showToast("You must be logged in to submit a review.");
      return;
    }

    setSubmittingReview(true);

    const payload = {
      productId: parseInt(id),
      userId: currentUser?.id,
      rating: newRating,
      review: newReviewText
    };

    console.log("Current User:", currentUser);
    console.log("Review Payload:", payload);

    fetch("http://localhost:8080/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) {
          let errorMessage = "Failed to submit review";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            try { errorMessage = await res.text() || errorMessage; } catch { /* ignore */ }
          }
          throw new Error(errorMessage);
        }
        return res.text();
      })
      .then(() => {
        showToast("Review submitted successfully!");
        setNewReviewText("");
        setNewRating(5);
        fetchReviews();
        if (fetchProducts) fetchProducts();
      })
      .catch(err => {
        console.error(err);
        showToast(err.message);
      })
      .finally(() => {
        setSubmittingReview(false);
      });
  };

  if (!product) return <p>Product not found</p>;

  // Dynamic Image resolution based on color selection
  let currentImage = "";
  if (color) {
    const matchedColor = colorMap.find(c => c.colour.toLowerCase() === color.toLowerCase());
    if (matchedColor) {
      currentImage = matchedColor.image;
    } else if (product.id === 2 && product.images && typeof product.images === 'object') {
      currentImage = product.images[color.toLowerCase()];
    }
  }
  if (!currentImage) {
    currentImage = Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'object' && product.images !== null ? Object.values(product.images)[0] : product.image || product.images || "");
  }

  const handleColorClick = (c) => {
    setColor(c);
    setColorSelectedManually(true);
  };

  const sizesList = sortSizes(product.sizes || []);

  const handleAddToCart = () => {
    if (sizesList.length > 0 && !size) {
      setMessage("Please select size.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    const hasColours = colorMap.length > 0 && colorMap.some(c => c.colour && c.colour.trim() !== "" && c.colour.toLowerCase().trim() !== "default");
    if (hasColours && !color) {
      setMessage("Please select a colour.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (product.id === 2 && !colorSelectedManually) {
      setMessage("Please select a colour.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    addToCart(product, size, color);
  };

  const handleAddToWishlist = () => {
    if (sizesList.length > 0 && !size) {
      setMessage("Please select size.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    const hasColours = colorMap.length > 0 && colorMap.some(c => c.colour && c.colour.trim() !== "" && c.colour.toLowerCase().trim() !== "default");
    if (hasColours && !color) {
      setMessage("Please select a colour.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (product.id === 2 && !colorSelectedManually) {
      setMessage("Please select a colour.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    addToWishlist(product, size, color);
  };

  return (
    <div className="product-details">
      <div className="back-arrow" onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center" }}>
        <IoArrowBack style={{ fontSize: "2rem", cursor: "pointer" }} />
      </div>

      <div className="details-icon-bar" style={{ display: "flex", gap: "2cm", alignItems: "center" }}>
        <Link to="/" className="details-icon" style={{ display: "flex", alignItems: "center" }}><IoHome /></Link>
        <Link to="/wishlist" className="details-icon"><div className="nav-icon-container"><LuHeart />{wishlist?.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div></Link>
        <Link to="/cart" className="details-icon"><div className="nav-icon-container"><LuShoppingCart />{cart?.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div></Link>
        <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
      </div>

      <div className="details-img-container">
        <img
          src={currentImage}
          alt={`${product.name} ${color ? color : ""}`}
          className="details-img"
        />
      </div>

      <h2 className="details-name">{product.name}</h2>

      <div style={{ fontSize: "1.05rem", color: "#f59e0b", margin: "0.5rem 0", display: "flex", gap: "0.5rem", justifyContent: "flex-start", alignItems: "center" }}>
        <span style={{ fontSize: "1.2rem", letterSpacing: "1px" }}>{renderStars(product.rating || 0)}</span>
        <span style={{ fontWeight: "bold", color: "#374151" }}>{product.rating !== undefined ? Number(product.rating).toFixed(1) : "0.0"}</span>
        <span style={{ color: "#6b7280" }}>({product.totalReviews || 0} Reviews)</span>
      </div>

      {product.description && (
        <p className="product-description" style={{ color: "#666", fontSize: "0.95rem", lineHeight: "1.5", margin: "1rem 0", textAlign: "left" }}>
          {product.description}
        </p>
      )}

      {/* Specifications & Seller Details */}
      <div style={{ borderTop: "1px solid #DBEAFE", borderBottom: "1px solid #DBEAFE", padding: "1rem 0", margin: "1rem 0", textAlign: "left", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {product.sku && (
          <div><strong>SKU:</strong> <span style={{ color: "#555" }}>{product.sku}</span></div>
        )}
        {product.seller && (
          <div><strong>Seller:</strong> <span style={{ color: "#555" }}>{product.seller}</span></div>
        )}
        {product.warranty && (
          <div><strong>Warranty:</strong> <span style={{ color: "#555" }}>{product.warranty}</span></div>
        )}
        {product.specifications && (
          <div>
            <strong>Specifications:</strong>
            <p style={{ margin: "4px 0 0 0", color: "#555", whiteSpace: "pre-line" }}>{product.specifications}</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "flex-start", fontSize: "1.1rem", margin: "1rem 0" }}>
        <strong style={{ color: "#555" }}>Price:</strong>
        {product.discount ? (() => {
          let finalPrice;
          let discountLabel = "";
          if (product.discountType === "PERCENT") {
            finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
            discountLabel = `${product.discount}% OFF`;
          } else if (product.discountType === "FLAT") {
            finalPrice = Math.round(product.price - product.discount);
            discountLabel = `₹${product.discount} OFF`;
          } else {
            finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
            discountLabel = `${product.discount}% OFF`;
          }
          if (finalPrice < 0) finalPrice = 0;
          return (
            <>
              <span style={{ textDecoration: "line-through", color: "#9ca3af" }}>₹{product.price}</span>
              <span style={{ fontWeight: "bold", color: "#2563EB" }}>₹{finalPrice}</span>
              <span style={{ fontSize: "0.85rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.2rem 0.4rem", borderRadius: "0.25rem", fontWeight: "bold" }}>{discountLabel}</span>
            </>
          );
        })() : (
          <span style={{ fontWeight: "bold", color: "#2563EB" }}>₹{product.price}</span>
        )}
      </div>

      {product.brand && (
        <p style={{ fontSize: "1.05rem", margin: "0.5rem 0", textAlign: "left" }}>
          <strong>{(product.category || "").toLowerCase() === "books" ? "Author:" : "Brand:"}</strong> {product.brand}
        </p>
      )}

      <p style={{ fontSize: "1.05rem", margin: "0.5rem 0", textAlign: "left" }}>
        <strong>Stock:</strong> {
          product.stockQuantity === 0 ? (
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>Out of Stock</span>
          ) : product.stockQuantity <= 10 ? (
            <span style={{ color: "#d97706", fontWeight: "bold" }}>Only {product.stockQuantity} left</span>
          ) : (
            <span style={{ color: "#059669", fontWeight: "bold" }}>In Stock</span>
          )
        }
      </p>

      <p style={{ fontSize: "1.05rem", margin: "0.5rem 0", textAlign: "left" }}>
        <strong>Expected Delivery:</strong> <span style={{ color: "#059669", fontWeight: "bold", marginLeft: "4px" }}>Estimated in 5 days</span>
      </p>

      {sizesList.length > 0 && (
        <div className="size-options" style={{ margin: "1rem 0" }}>
          {sizesList.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`size-button ${size === s ? "selected" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {(() => {
        const hasColours = colorMap.length > 0 && colorMap.some(c => c.colour && c.colour.trim() !== "" && c.colour.toLowerCase().trim() !== "default");
        if (hasColours) {
          return (
            <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: "600", color: "#374151" }}>
                Selected Colour: <span style={{ color: "#2563EB", fontWeight: "bold" }}>{color || "None"}</span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", padding: "0.25rem 0" }}>
                {colorMap.map((c) => {
                  const { code, isKnown } = getColorInfo(c.colour);
                  return (
                    <div key={c.colour} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        type="button"
                        title={c.colour}
                        onClick={() => handleColorClick(c.colour)}
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: code,
                          border: color === c.colour ? "3px solid #2563EB" : (c.colour.toLowerCase().trim() === "white" ? "1px solid #d1d5db" : "1px solid #d1d5db"),
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: color === c.colour ? "0 0 8px rgba(37, 99, 235, 0.4)" : "none",
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                      {!isKnown && <span style={{ fontSize: "0.95rem", color: "#475569", fontWeight: "500" }}>{c.colour}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else if (product.id === 2) {
          return (
            <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: "600", color: "#374151" }}>
                Selected Colour: <span style={{ color: "#2563EB", fontWeight: "bold" }}>{color || "None"}</span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", padding: "0.25rem 0" }}>
                {[
                  { name: "Blue" },
                  { name: "Pink" },
                  { name: "Yellow" }
                ].map((c) => {
                  const { code, isKnown } = getColorInfo(c.name);
                  return (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        key={c.name}
                        type="button"
                        title={c.name}
                        onClick={() => handleColorClick(c.name)}
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: code,
                          border: color === c.name ? "3px solid #2563EB" : (c.name.toLowerCase().trim() === "white" ? "1px solid #d1d5db" : "1px solid #d1d5db"),
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: color === c.name ? "0 0 8px rgba(37, 99, 235, 0.4)" : "none",
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                      {!isKnown && <span style={{ fontSize: "0.95rem", color: "#475569", fontWeight: "500" }}>{c.name}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })()}

      {message && <p className="flash-message">{message}</p>}

      <button
        onClick={handleAddToCart}
        className="add-button"
        disabled={product.stockQuantity === 0}
        style={{
          backgroundColor: product.stockQuantity === 0 ? "#9ca3af" : "#9333ea",
          cursor: product.stockQuantity === 0 ? "not-allowed" : "pointer"
        }}
      >
        {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
      <button onClick={handleAddToWishlist} className="wishlist-button">Add to Wishlist</button>

      {/* Reviews & Ratings Section */}
      <div style={{ marginTop: "2.5rem", borderTop: "2px solid #DBEAFE", paddingTop: "2rem", textAlign: "left" }}>
        <h3 style={{ color: "#2563EB", fontSize: "1.4rem", margin: "0 0 1.5rem 0", fontWeight: "bold" }}>Reviews & Ratings</h3>

        {/* Read Reviews */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
          {reviews.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>No reviews yet for this product. Be the first to share your thoughts!</p>
          ) : (
            reviews.map((rev, idx) => (
              <div key={rev.id || idx} style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1rem", color: "#f59e0b", letterSpacing: "1px" }}>{renderStars(rev.rating)}</span>
                  {rev.createdAt && (
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                {rev.review && rev.review.trim() && (
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#4b5563", lineHeight: "1.5" }}>{rev.review}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        {currentUser && currentUser.id ? (
          <form onSubmit={handleSubmitReview} style={{ backgroundColor: "#fff5f7", border: "1px solid #ffd1d7", borderRadius: "0.75rem", padding: "1.5rem", marginTop: "1rem" }}>
            <h4 style={{ color: "#2563EB", margin: "0 0 1rem 0", fontSize: "1.15rem", fontWeight: "bold" }}>Rate Product</h4>

            {/* Rating selection (Stars) */}
            <div style={{ display: "flex", gap: "0.3cm", alignItems: "center", marginBottom: "1.2rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: "600", color: "#555" }}>Your Rating:</span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setNewRating(star)}
                    style={{
                      fontSize: "1.8rem",
                      cursor: "pointer",
                      color: star <= newRating ? "#f59e0b" : "#d1d5db",
                      transition: "color 0.2s"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#555", marginBottom: "0.5rem" }}>Your Review</label>
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Write a review (optional)"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                  minHeight: "90px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  fontSize: "0.95rem"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="add-button"
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                padding: "0.6rem 1.5rem",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.95rem",
                width: "auto",
                display: "inline-block",
                transition: "all 0.2s"
              }}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", textAlign: "center" }}>
            <p style={{ margin: "0 0 0.75rem 0", color: "#4b5563" }}>You must be logged in to leave a review.</p>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#9333ea",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Sign In to Rate
            </button>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h3 className="related-products-title">Related Products</h3>
          <div className="related-products-grid">
            {relatedProducts.map((relProduct) => {
              const imgSrc = (relProduct.colours && relProduct.colours[0] && relProduct.colours[0].image) ? relProduct.colours[0].image :
                (Array.isArray(relProduct.images) ? relProduct.images[0] : relProduct.image || relProduct.images || "");

              return (
                <Link to={`/product/${relProduct.id}`} key={relProduct.id} className="product-card" style={{ textDecoration: "none", textAlign: "center" }}>
                  <img
                    src={imgSrc}
                    alt={relProduct.name}
                    className="product-img"
                  />
                  <h2 className="product-name">{relProduct.name}</h2>
                  {relProduct.brand && (
                    <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", marginTop: "2px" }}>{relProduct.brand}</div>
                  )}
                  <div style={{ fontSize: "0.8rem", color: "#f59e0b", margin: "3px 0", display: "flex", gap: "0.25rem", justifyContent: "center", alignItems: "center" }}>
                    <span><LuStar fill="#facc15" color="#facc15" /> {relProduct.rating !== undefined ? Number(relProduct.rating).toFixed(1) : "0.0"}</span>
                    <span style={{ color: "#9ca3af" }}>({relProduct.totalReviews || 0})</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                    {relProduct.stockQuantity === 0 ? (
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>Out of Stock</span>
                    ) : relProduct.stockQuantity <= 10 ? (
                      <span style={{ color: "#d97706", fontWeight: "bold" }}>Only {relProduct.stockQuantity} left</span>
                    ) : (
                      <span style={{ color: "#059669", fontWeight: "bold" }}>In Stock</span>
                    )}
                  </div>
                  {relProduct.discount ? (() => {
                    let finalPrice;
                    let discountLabel = "";
                    if (relProduct.discountType === "PERCENT") {
                      finalPrice = Math.round(relProduct.price - (relProduct.price * relProduct.discount) / 100);
                      discountLabel = `-${relProduct.discount}%`;
                    } else if (relProduct.discountType === "FLAT") {
                      finalPrice = Math.round(relProduct.price - relProduct.discount);
                      discountLabel = `-₹${relProduct.discount}`;
                    } else {
                      finalPrice = Math.round(relProduct.price - (relProduct.price * relProduct.discount) / 100);
                      discountLabel = `-${relProduct.discount}%`;
                    }
                    if (finalPrice < 0) finalPrice = 0;
                    return (
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center", margin: "4px 0" }}>
                        <p className="product-price" style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.9rem" }}>₹{relProduct.price}</p>
                        <p className="product-price" style={{ fontWeight: "bold", color: "#2563EB" }}>₹{finalPrice}</p>
                        <span style={{ fontSize: "0.8rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.1rem 0.3rem", borderRadius: "0.25rem", fontWeight: "bold" }}>{discountLabel}</span>
                      </div>
                    );
                  })() : (
                    <p className="product-price">₹{relProduct.price}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Profile Dashboard with links to subpages and Logout
function Profile({ handleLogout, user, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState([]);
  const [isExpenseHovered, setIsExpenseHovered] = useState(false);
  const [isBudgetHovered, setIsBudgetHovered] = useState(false);

  const fetchOrders = () => {
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:8080/orders/user/${currentUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load orders");
          return res.json();
        })
        .then((data) => {
          setOrders(data);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.id]);

  const onLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="profile-dashboard" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
        </div>
      </div>
      <h2>Profile Dashboard</h2>
      <nav className="profile-nav">
        <NavLink to="" end className={({ isActive }) => isActive ? "active-link" : ""}>Details</NavLink>
        <NavLink to="track-orders" className={({ isActive }) => isActive ? "active-link" : ""}>Track My Orders</NavLink>
        <NavLink to="order-history" className={({ isActive }) => isActive ? "active-link" : ""}>Order History</NavLink>
        <NavLink to="exchanged-orders" className={({ isActive }) => isActive ? "active-link" : ""}>Exchanged Orders</NavLink>
        <NavLink to="cancelled-orders" className={({ isActive }) => isActive ? "active-link" : ""}>Cancelled Orders</NavLink>
        <NavLink to="notifications" className={({ isActive }) => isActive ? "active-link" : ""}>Notifications</NavLink>
        <NavLink
          to="/expense-tracker"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#0284c7" : (isExpenseHovered ? "#0284c7" : "#0ea5e9"),
            color: "white",
            fontWeight: "bold",
            border: "1px solid " + (isActive ? "#0284c7" : (isExpenseHovered ? "#0284c7" : "#0ea5e9")),
            borderRadius: "4px",
            padding: "0.3rem 0.6rem",
            display: "inline-block",
            transition: "all 0.2s ease"
          })}
          onMouseEnter={() => setIsExpenseHovered(true)}
          onMouseLeave={() => setIsExpenseHovered(false)}
        >
          Expense Tracker
        </NavLink>
        <NavLink
          to="/budget-manager"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#2563EB" : (isBudgetHovered ? "#2563EB" : "#2563EB"),
            color: "white",
            fontWeight: "bold",
            border: "1px solid " + (isActive ? "#2563EB" : (isBudgetHovered ? "#2563EB" : "#2563EB")),
            borderRadius: "4px",
            padding: "0.3rem 0.6rem",
            display: "inline-block",
            transition: "all 0.2s ease"
          })}
          onMouseEnter={() => setIsBudgetHovered(true)}
          onMouseLeave={() => setIsBudgetHovered(false)}
        >
          Budget Manager
        </NavLink>
        <button onClick={onLogoutClick} className="logout-button">Logout</button>
      </nav>

      <div className="profile-content">
        <Outlet context={{ orders, fetchOrders, notifications, markNotificationAsRead }} /> {/* Renders nested routes */}
      </div>
    </div>
  )
}

function ProfileDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  console.log("Profile page received logged-in user from localStorage:", loggedInUser);

  const [originalUser, setOriginalUser] = useState({
    name: loggedInUser?.fullName || loggedInUser?.name || "",
    contactNo: loggedInUser?.phone || loggedInUser?.contactNo || "",
    gender: loggedInUser?.gender || "",
    email: loggedInUser?.email || "",
    address: loggedInUser?.address || "",
  });

  const [editableUser, setEditableUser] = useState({
    name: loggedInUser?.fullName || loggedInUser?.name || "",
    contactNo: loggedInUser?.phone || loggedInUser?.contactNo || "",
    gender: loggedInUser?.gender || "",
    email: loggedInUser?.email || "",
    address: loggedInUser?.address || "",
  });

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      console.log("Fetching profile from backend database for user ID:", loggedInUser.id);
      fetch(`http://localhost:8080/users/${loggedInUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load user details");
          return res.json();
        })
        .then((data) => {
          console.log("Backend returned full user object on load:", data);
          const mapped = {
            name: data.fullName || "",
            contactNo: data.phone || "",
            gender: data.gender || "",
            email: data.email || "",
            address: data.address || "",
          };
          setOriginalUser(mapped);
          setEditableUser(mapped);
          // Sync localStorage
          localStorage.setItem("user", JSON.stringify(data));
          console.log("Sync localStorage 'user' with loaded database profile:", data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    console.log("Cancel clicked: Reverting form fields back to original saved user data:", originalUser);
    setEditableUser(originalUser);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (loggedInUser && loggedInUser.id) {
      const payload = {
        id: loggedInUser.id,
        fullName: editableUser.name,
        email: editableUser.email,
        phone: editableUser.contactNo,
        gender: editableUser.gender,
        address: editableUser.address,
        role: loggedInUser.role || "USER"
      };
      console.log("Sending PUT request with payload to update user profile in MySQL:", payload);
      fetch(`http://localhost:8080/users/${loggedInUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update profile");
          return res.json();
        })
        .then((data) => {
          console.log("Backend returned updated user object on save success:", data);
          const mapped = {
            name: data.fullName || "",
            contactNo: data.phone || "",
            gender: data.gender || "",
            email: data.email || "",
            address: data.address || "",
          };
          setOriginalUser(mapped);
          setEditableUser(mapped);
          localStorage.setItem("user", JSON.stringify(data));
          console.log("Updated localStorage 'user' with new profile:", data);
          setIsEditing(false);
          showToast("Profile details updated successfully!");
        })
        .catch((err) => {
          console.error(err);
          showToast("Error updating profile: " + err.message + "\\n\\nPlease ensure your Spring Boot backend server is running on port 8080.");
        });
    } else {
      showToast("No active session found.");
    }
  };

  return (
    <div className="profile-details" style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #DBEAFE" }}>
      <h3 style={{ color: "#2563EB", marginBottom: "1rem" }}>My Details</h3>

      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ fontWeight: "600" }}>Name: <input type="text" name="name" value={editableUser.name} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }} /></label>
          <label style={{ fontWeight: "600" }}>Contact No.: <input type="tel" name="contactNo" value={editableUser.contactNo} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }} /></label>
          <label style={{ fontWeight: "600" }}>Gender:
            <select name="gender" value={editableUser.gender} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label style={{ fontWeight: "600" }}>Email: <input type="email" name="email" value={editableUser.email} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }} /></label>
          <label style={{ fontWeight: "600" }}>Address: <textarea name="address" value={editableUser.address} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }} /></label>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={handleSave} className="save-button" style={{ backgroundColor: "#2563EB", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Save Changes</button>
            <button onClick={handleCancel} style={{ backgroundColor: "#6c757d", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "1.05rem" }}>
          <div><strong>Name:</strong> {originalUser.name || "Not set"}</div>
          <div><strong>Email:</strong> {originalUser.email || "Not set"}</div>
          <div><strong>Phone Number:</strong> {originalUser.contactNo || "Not set"}</div>
          <div><strong>Gender:</strong> {originalUser.gender || "Not set"}</div>
          <div><strong>Address:</strong> {originalUser.address || "Not set"}</div>
          <button onClick={() => setIsEditing(true)} style={{ backgroundColor: "#9333ea", color: "white", padding: "0.5rem 1.25rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "1rem", alignSelf: "flex-start" }}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

function TrackOrders() {
  const { orders, fetchOrders } = useOutletContext();
  const [exchangeItemId, setExchangeItemId] = useState(null);
  const [exchangeReason, setExchangeReason] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  const getEstimatedDateFallback = (orderDate) => {
    if (!orderDate) return "";
    const parts = orderDate.split("-");
    if (parts.length !== 3) return "";
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + 5);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCancelItem = async (itemId) => {
    if (window.confirm("Are you sure you want to cancel this item?")) {
      try {
        const res = await fetch(`http://localhost:8080/orders/item/${itemId}/cancel`, {
          method: "PUT"
        });
        if (!res.ok) {
          throw new Error("Failed to cancel item");
        }
        showToast("Item cancelled successfully!");
        fetchOrders();
      } catch (err) {
        showToast(err.message);
      }
    }
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    if (!exchangeReason.trim()) {
      showToast("Please enter a reason for exchange.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/orders/item/${exchangeItemId}/exchange`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: exchangeReason })
      });
      if (!res.ok) {

        let errorMessage =
          "Failed to submit exchange request";

        try {

          const errorData =
            await res.json();

          errorMessage =
            errorData.message ||
            errorMessage;

        } catch {

          try {

            errorMessage =
              await res.text();

          } catch {

            // ignore

          }
        }

        throw new Error(
          errorMessage
        );
      }
      showToast("Exchange request submitted successfully!");
      setExchangeItemId(null);
      setExchangeReason("");
      fetchOrders();
    } catch (err) {
      showToast(err.message);
    }
  };

  // Map orders without filtering out any order or item. Handle null statuses with fallbacks.
  const activeOrders = orders.map(order => {
    const orderStatus = order.status === null || order.status === undefined ? "Preparing Your Order" : order.status;
    const items = (order.items || []).map(item => ({
      ...item,
      status: item.status === null || item.status === undefined ? "Ordered" : item.status
    }));
    return {
      ...order,
      status: orderStatus,
      items: items
    };
  });

  const getStatusBadge = (status) => {
    let bg = "#f3f4f6";
    let color = "#374151";

    switch (status) {
      case "Delivered":
        bg = "#d1fae5";
        color = "#065f46";
        break;
      case "Cancelled":
        bg = "#fee2e2";
        color = "#991b1b";
        break;
      case "Unable To Deliver":
        bg = "#fef3c7";
        color = "#92400e";
        break;
      case "Exchange Requested":
        bg = "#f3e8ff";
        color = "#6b21a8";
        break;
      case "Exchanged":
        bg = "#dbeafe";
        color = "#1e40af";
        break;
      default:
        bg = "#eff6ff";
        color = "#1d4ed8";
        break;
    }

    return (
      <span style={{
        backgroundColor: bg,
        color: color,
        padding: "0.25rem 0.6rem",
        borderRadius: "4px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        display: "inline-block"
      }}>
        {status}
      </span>
    );
  };

  const renderShipmentTimeline = (order) => {
    console.log(
      "Timeline Status:",
      order.timelineStatus
    );
    const steps = ["Ordered", "Packed", "Picked Up", "In Transit", "Out For Delivery", "Delivered"];
    const dates = [
      order.date,
      order.packedDate,
      order.pickedUpDate,
      order.inTransitDate,
      order.outForDeliveryDate,
      order.deliveredDate
    ];

    const rawStatus = order.items?.[0]?.status || order.timelineStatus || "Ordered";
    // For timeline rendering, treat exchange statuses as "Delivered" since the item was delivered before exchange
    const currentStatus = (rawStatus === "Exchanged" || rawStatus === "Exchange Requested")
      ? "Delivered"
      : rawStatus;
    let currentStepIndex = steps.findIndex(
      step => step.toLowerCase() === currentStatus.toLowerCase()
    );

    // Map other potential/unknown backend statuses to appropriate timeline steps
    if (currentStepIndex === -1) {
      const statusLower = currentStatus.toLowerCase();
      if (statusLower === "shipped") {
        currentStepIndex = 3; // map Shipped to In Transit
      } else {
        currentStepIndex = 0; // default/fallback to Ordered (e.g. for "Preparing Your Order", etc.)
      }
    }

    const isCancelled = order.status === "Cancelled";
    const progressPercent = currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

    return (
      <div style={{ margin: "1rem 0 2rem 0", padding: "0 0.5rem" }}>
        <h4 style={{ margin: "0 0 1.5rem 0", color: "#374151", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>Shipment Tracking</span>
          {isCancelled && (
            <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "9999px", fontWeight: "bold" }}>
              Cancelled
            </span>
          )}
        </h4>

        {/* Timeline container */}
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", margin: "0 auto", minHeight: "80px" }}>

          {/* Progress Bar Track */}
          <div style={{
            position: "absolute",
            top: "14px",
            left: "0",
            right: "0",
            height: "4px",
            backgroundColor: "#e5e7eb",
            zIndex: 1
          }} />

          {/* Progress Bar Active Fill */}
          {!isCancelled && (
            <div style={{
              position: "absolute",
              top: "14px",
              left: "0",
              height: "4px",
              backgroundColor: "#2563EB",
              width: `${progressPercent}%`,
              transition: "width 0.4s ease",
              zIndex: 2
            }} />
          )}

          {/* Steps */}
          {steps.map((step, idx) => {
            let isCompleted = false;
            let isCurrent = false;

            if (!isCancelled) {
              if (currentStatus.toLowerCase() === "delivered") {
                isCompleted = true;
              } else {
                isCompleted = idx < currentStepIndex;
                isCurrent = idx === currentStepIndex;
              }
            }

            const stepDate = dates[idx];

            let dotBg = "#e5e7eb";
            let dotBorder = "none";
            let dotColor = "#9ca3af";
            let textColor = "#9ca3af";
            let fontWeight = "normal";

            if (isCompleted) {
              dotBg = "#2563EB";
              dotColor = "#fff";
              textColor = "#1f2937";
              fontWeight = "600";
            } else if (isCurrent) {
              dotBg = "#fff";
              dotBorder = "3px solid #2563EB";
              dotColor = "#2563EB";
              textColor = "#2563EB";
              fontWeight = "bold";
            }

            return (
              <div key={step} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 3,
                flex: 1,
                position: "relative",
                textAlign: "center"
              }}>
                {/* Step Circle */}
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: dotBg,
                  border: dotBorder,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  color: dotColor,
                  boxShadow: isCurrent ? "0 0 0 4px rgba(219, 39, 119, 0.2)" : "none",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}>
                  {isCompleted ? "✓" : (isCurrent ? "●" : "○")}
                </div>

                {/* Step Text Label */}
                <div style={{
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: fontWeight,
                  color: textColor,
                  maxWidth: "90px",
                  wordWrap: "break-word"
                }}>
                  {step}
                </div>

                {/* Step Date */}
                {stepDate && (
                  <div style={{
                    marginTop: "0.2rem",
                    fontSize: "0.7rem",
                    color: isCurrent ? "#2563EB" : "#6b7280"
                  }}>
                    {stepDate}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  console.log("orders.length", orders.length);

  if (activeOrders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>No Active Orders</h3>
        <p>You have no active orders to track.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h3 style={{ color: "#2563EB", margin: 0 }}>Track My Orders</h3>
      {activeOrders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #DBEAFE", borderRadius: "8px", backgroundColor: "#fff", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          {/* Card Header (clickable to toggle expansion) */}
          <div
            onClick={() => toggleOrderExpand(order.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F8FAFC",
              borderBottom: "1px solid #DBEAFE",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.9rem", color: "#4b5563" }}>
              <div>
                <strong style={{ color: "#2563EB" }}>Order ID:</strong> #{order.id}
              </div>
              <div>
                <strong>Ordered on:</strong> {order.date}
              </div>
              <div>
                <strong>Total Amount:</strong> ₹{order.totalAmount || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </div>
              {order.deliveryDate && (
                <div>
                  <strong>Delivery Date:</strong> {order.deliveryDate}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`http://localhost:8080/invoice/${order.id}`, "_blank");
                }}
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.3rem 0.75rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  transition: "background-color 0.2s",
                  marginRight: "0.5rem"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#be185d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563EB"}
              >
                Download Invoice
              </button>
              <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#2563EB" }}>
                {expandedOrders[order.id] ? "Hide Details" : "Track Order"}
              </span>
              <span style={{ transform: expandedOrders[order.id] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block", fontSize: "0.9rem", color: "#2563EB" }}>
                ▼
              </span>
            </div>
          </div>

          {/* Card Body (visible when expanded) */}
          {expandedOrders[order.id] && (
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#4b5563", fontSize: "0.95rem" }}>Status:</div>
                  <div style={{ marginTop: "4px" }}>{getStatusBadge(order.items?.[0]?.status || order.timelineStatus || "Ordered")}</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#4b5563", fontSize: "0.95rem" }}>Estimated Delivery:</div>
                  <div style={{ marginTop: "4px", fontWeight: "bold", color: "#1f2937", fontSize: "1.05rem" }}>
                    {order.estimatedDeliveryDate || getEstimatedDateFallback(order.date)}
                  </div>
                </div>
              </div>
              {/* Shipment Timeline UI */}
              {renderShipmentTimeline(order)}

              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "1.5rem", marginTop: "1.5rem" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "#374151" }}>Items in this Order</h4>
                {order.items.map((item, idx) => {
                  const isItemCancellable = item.status === "Ordered";
                  const isItemExchangeable = item.status === "Delivered";

                  return (
                    <div key={item.id || idx} style={{ borderBottom: idx === order.items.length - 1 ? "none" : "1px solid #f3f4f6", paddingBottom: idx === order.items.length - 1 ? 0 : "1rem", marginBottom: idx === order.items.length - 1 ? 0 : "1rem" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <img src={item.images} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: "1.05rem" }}>{item.name}</h4>
                          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                            Size: {item.size} | Color: {item.color || "Default"} | Qty: {item.quantity}
                          </p>
                          <div style={{ marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <strong>Status: </strong>
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</div>
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                            {isItemCancellable && (
                              <button
                                onClick={() => handleCancelItem(item.id)}
                                style={{ backgroundColor: "#ef4444", color: "white", padding: "0.3rem 0.75rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.8rem", transition: "background-color 0.2s" }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
                              >
                                Cancel Item
                              </button>
                            )}
                            {isItemExchangeable && (
                              <button
                                onClick={() => setExchangeItemId(item.id)}
                                style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.3rem 0.75rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.8rem", transition: "background-color 0.2s" }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                              >
                                Request Exchange
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {exchangeItemId === item.id && (
                        <form onSubmit={handleExchangeSubmit} style={{ marginTop: "1rem", padding: "1rem", border: "1px dashed #3b82f6", borderRadius: "6px", backgroundColor: "#eff6ff" }}>
                          <h4 style={{ margin: "0 0 0.5rem 0", color: "#1e3a8a" }}>Reason for Exchange</h4>
                          <textarea
                            value={exchangeReason}
                            onChange={(e) => setExchangeReason(e.target.value)}
                            placeholder="Please state the reason (e.g. wrong size, damaged, colour issue)..."
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "60px", fontFamily: "inherit" }}
                            required
                          />
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <button type="submit" style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.3rem 0.8rem", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                              Submit Request
                            </button>
                            <button type="button" onClick={() => setExchangeItemId(null)} style={{ backgroundColor: "#6b7280", color: "white", padding: "0.3rem 0.8rem", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderHistory() {
  const { orders, fetchOrders } = useOutletContext();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>No Orders Yet</h3>
        <p>Looks like you haven't placed any orders yet. Start shopping now!</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h3 style={{ color: "#2563EB", margin: 0 }}>Order History</h3>
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #DBEAFE", borderRadius: "8px", padding: "1rem", backgroundColor: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "0.5rem", marginBottom: "1rem", fontSize: "0.9rem", color: "#666", flexWrap: "wrap", gap: "0.5rem" }}>
            <span><strong>Order ID:</strong> #{order.id}</span>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <span>
                <strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate || (() => {
                  if (!order.date) return "";
                  const parts = order.date.split("-");
                  if (parts.length !== 3) return "";
                  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                  d.setDate(d.getDate() + 5);
                  const yyyy = d.getFullYear();
                  const mm = String(d.getMonth() + 1).padStart(2, '0');
                  const dd = String(d.getDate()).padStart(2, '0');
                  return `${yyyy}-${mm}-${dd}`;
                })()}
              </span>
              <span><strong>Ordered on:</strong> {order.date}</span>
            </div>
          </div>
          {order.items.map((item, idx) => {
            return (
              <div key={item.id || idx} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: idx === order.items.length - 1 ? 0 : "1rem" }}>
                <img src={item.images} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>{item.name}</h4>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666", display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                    Size: {item.size} | Color: <ColorSwatch colourName={item.color || "Default"} showNameAlways={true} /> | Qty: {item.quantity} | Status: <span style={{ fontWeight: "bold", color: item.status === "Delivered" ? "#10b981" : item.status === "Cancelled" ? "#ef4444" : "#f59e0b" }}>{item.status}</span>
                  </p>
                </div>
                <div style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</div>
              </div>
            );
          })}
          {(order.status === "Delivered" || order.timelineStatus === "Delivered" || (order.items && order.items.some(item => item.status === "Delivered"))) && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "1rem", marginTop: "1rem" }}>
              <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.95rem" }}>Delivered</span>
              <button
                onClick={() => window.open(`http://localhost:8080/invoice/${order.id}`, "_blank")}
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.3rem 0.75rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#be185d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563EB"}
              >
                Download Invoice
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ExchangedOrders() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [exchangedItems, setExchangedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:8080/orders/exchanged/${currentUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load exchanged orders");
          return res.json();
        })
        .then((data) => {
          const items = [];
          data.forEach(order => {
            (order.items || []).forEach(item => {
              if (item.status === "Exchanged" || order.status === "Exchanged") {
                items.push({
                  ...item,
                  orderId: order.id,
                  orderDate: order.date
                });
              }
            });
          });
          setExchangedItems(items);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>Loading Exchanged Orders...</h3>
      </div>
    );
  }

  if (exchangedItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>No Exchanged Orders</h3>
        <p>You have no exchange requests at this time.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h3 style={{ color: "#2563EB", margin: 0 }}>Exchanged Orders</h3>
      {exchangedItems.map((item, idx) => {
        return (
          <div key={item.id || idx} style={{ display: "flex", gap: "1rem", alignItems: "center", border: "1px solid #DBEAFE", borderRadius: "8px", padding: "1rem", backgroundColor: "#fff" }}>
            <img src={item.images} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: "1rem" }}>{item.name}</h4>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                Order ID: #{item.orderId} | Size: {item.size} | Color: {item.color || "Default"}
              </p>
              {item.exchangeReason && (
                <div style={{ fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic", marginTop: "2px" }}>
                  Reason: {item.exchangeReason}
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>{item.status || "Exchanged"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CancelledOrders() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [cancelledItems, setCancelledItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:8080/orders/cancelled/${currentUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load cancelled orders");
          return res.json();
        })
        .then((data) => {
          const items = [];
          data.forEach(order => {
            (order.items || []).forEach(item => {
              if (item.status === "Cancelled" || order.status === "Cancelled") {
                items.push({
                  ...item,
                  orderId: order.id,
                  orderDate: order.date
                });
              }
            });
          });
          setCancelledItems(items);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>Loading Cancelled Orders...</h3>
      </div>
    );
  }

  if (cancelledItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <h3>No Cancelled Orders</h3>
        <p>You have no cancelled orders.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h3 style={{ color: "#2563EB", margin: 0 }}>Cancelled Orders</h3>
      {cancelledItems.map((item, idx) => {
        return (
          <div key={item.id || idx} style={{ display: "flex", gap: "1rem", alignItems: "center", border: "1px solid #DBEAFE", borderRadius: "8px", padding: "1rem", backgroundColor: "#fff" }}>
            <img src={item.images} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: "1rem" }}>{item.name}</h4>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                Order ID: #{item.orderId} | Size: {item.size} | Color: {item.color || "Default"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>{item.status || "Cancelled"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NotificationBell({ notifications, markNotificationAsRead, user }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-action-item"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          color: "inherit",
          fontFamily: "inherit"
        }}
        title="Notifications"
      >
        <div style={{ position: "relative" }}>
          <LuBell className="nav-icon" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "#ef4444",
              color: "white",
              fontSize: "0.6rem",
              fontWeight: "bold",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="nav-label">Updates</span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999
            }}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            width: "300px",
            maxHeight: "350px",
            backgroundColor: "white",
            border: "1px solid #DBEAFE",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            zIndex: 10000,
            overflowY: "auto",
            padding: "0.5rem",
            textAlign: "left",
            color: "#333",
            fontFamily: "inherit"
          }}>
            <div style={{
              fontWeight: "bold",
              fontSize: "0.95rem",
              padding: "0.5rem",
              borderBottom: "1px solid #f3f4f6",
              color: "#2563EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Notifications Center</span>
              {unreadCount > 0 && <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{unreadCount} unread</span>}
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#6b7280", fontSize: "0.9rem" }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.readStatus) {
                      markNotificationAsRead(n.id);
                    }
                  }}
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #f9fafb",
                    cursor: "pointer",
                    backgroundColor: n.readStatus ? "transparent" : "#F8FAFC",
                    transition: "background-color 0.2s",
                    borderRadius: "4px",
                    margin: "2px 0"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = n.readStatus ? "#f9fafb" : "#DBEAFE"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = n.readStatus ? "transparent" : "#F8FAFC"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                    <span style={{ fontWeight: n.readStatus ? "500" : "bold", color: "#111827", fontSize: "0.85rem" }}>
                      {n.title}
                    </span>
                    {!n.readStatus && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", flexShrink: 0, marginLeft: "4px" }} />
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#4b5563", marginBottom: "4px", lineHeight: "1.3" }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                    {n.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProfileNotifications() {
  const { notifications, markNotificationAsRead } = useOutletContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h3 style={{ color: "#2563EB", margin: 0 }}>Notifications Center</h3>
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666", backgroundColor: "#fff", border: "1px solid #DBEAFE", borderRadius: "8px" }}>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.readStatus) {
                  markNotificationAsRead(n.id);
                }
              }}
              style={{
                border: "1px solid #DBEAFE",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: n.readStatus ? "#fff" : "#F8FAFC",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                transition: "background-color 0.2s, transform 0.2s",
                position: "relative"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = n.readStatus ? "#fdf2f4" : "#DBEAFE";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = n.readStatus ? "#fff" : "#F8FAFC";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.05rem", color: "#2563EB" }}>
                  {n.title}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {n.date}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#4b5563", lineHeight: "1.4" }}>
                {n.message}
              </p>
              {!n.readStatus && (
                <span style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "9999px"
                }}>
                  Unread
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill all fields.");
      return;
    }
    fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {

        if (!res.ok) {

          const errorMessage =
            await res.text();

          throw new Error(
            errorMessage
          );
        }

        return res.json();
      })
      .then((user) => {
        console.log("Logged in user response from backend:", user);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        showToast("Login successful!");
        navigate("/");
      })
      .catch((err) => {

        console.error(err);

        showToast(err.message);
      });
  };

  return (
    <div className="address-container" style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", backgroundColor: "white", borderRadius: "1rem", border: "2px solid #DBEAFE", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
        </Link>
      </div>
      <h2 style={{ textAlign: "center", color: "#2563EB" }}>User Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <button type="submit" className="confirm-button" style={{ marginTop: "0.5rem" }}>Log In</button>
      </form>
      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
        Don't have an account? <Link to="/signup" style={{ color: "#9333ea", fontWeight: "bold" }}>Sign Up</Link>
      </div>
      <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
        Are you an Admin? <Link to="/admin-login" style={{ color: "#2563EB", fontWeight: "bold" }}>Admin Portal</Link>
      </div>
    </div>
  )
}

function SignupPage({ setUser }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      fullName,
      email,
      password,
      role: "USER"
    };

    try {
      const response = await fetch(
        "http://localhost:8080/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        });

      if (!response.ok) {
        const text = await response.text();
        showToast(text);
        return;
      }

      const data = await response.json();
      console.log("Registered user response from backend:", data);
      localStorage.setItem("user", JSON.stringify(data));
      if (setUser) {
        setUser(data);
      }
      showToast("Registration successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      showToast("Error registering user");
    }
  };

  return (
    <div className="address-container" style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", backgroundColor: "white", borderRadius: "1rem", border: "2px solid #DBEAFE", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
        </Link>
      </div>
      <h2 style={{ textAlign: "center", color: "#2563EB" }}>Create Account</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <button type="submit" className="confirm-button" style={{ marginTop: "0.5rem" }}>Register</button>
      </form>
      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
        Already have an account? <Link to="/login" style={{ color: "#9333ea", fontWeight: "bold" }}>Sign In</Link>
      </div>
    </div>
  )
}

function AdminLoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminSession = { email, name: "Administrator", role: "admin" };
      localStorage.setItem("user", JSON.stringify(adminSession));
      setUser(adminSession);
      showToast("Admin logged in successfully!");
      navigate("/admin-dashboard");
    } else {
      showToast("Invalid Admin credentials!");
    }
  };

  return (
    <div className="address-container" style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", backgroundColor: "white", borderRadius: "1rem", border: "2px solid #2563EB", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
        </Link>
      </div>
      <h2 style={{ textAlign: "center", color: "#2563EB" }}>Admin Portal</h2>
      <div style={{ textAlign: "center", color: "#ef4444", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem" }}>
        <LuTriangleAlert /> Administrator Portal Only
      </div>
      <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
        />
        <button type="submit" className="confirm-button" style={{ marginTop: "0.5rem", backgroundColor: "#2563EB" }}>Access Dashboard</button>
      </form>
      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
        Looking for shopper sign in? <Link to="/login" style={{ color: "#9333ea", fontWeight: "bold" }}>User Portal</Link>
      </div>
    </div>
  )
}

function AddProductPage({ products, setProducts, user, fetchProducts }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const editId = params.get("edit");

  const normalizeSubCategory = (sub) => {
    if (!sub) return "";
    const subLower = sub.toLowerCase().trim();
    if (subLower === "smart watches") return "Smart Watches";
    if (subLower === "non fiction") return "Non Fiction";
    if (subLower === "self-help" || subLower === "self help") return "Self Help";
    return subLower.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Protection
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  const isEditing = !!editId;
  const editingProduct = isEditing ? products.find(p => String(p.id) === String(editId)) : null;

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colourEntries, setColourEntries] = useState([{ colour: "", image: "" }]);
  const [brand, setBrand] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [warranty, setWarranty] = useState("");
  const [seller, setSeller] = useState("");

  const getSizeOptions = (cat, subCat) => {
    const normCat = (cat || "").toLowerCase().trim();
    const normSub = (subCat || "").toLowerCase().trim();

    if (normCat === "fashion") {
      return ["XS", "S", "M", "L", "XL", "XXL"];
    }
    if (normCat === "electronics") {
      if (normSub === "mobiles") {
        return ["64GB", "128GB", "256GB", "512GB", "1TB"];
      }
      if (normSub === "laptops") {
        return ["256GB", "512GB", "1TB", "2TB"];
      }
    }
    if (normCat === "beauty") {
      return ["50ml", "100ml", "200ml", "500ml"];
    }
    if (normCat === "sports") {
      return ["Small", "Medium", "Large"];
    }
    return [];
  };

  useEffect(() => {
    if (editingProduct) {
      setId(editingProduct.id);
      setName(editingProduct.name || "");
      setDescription(editingProduct.description || "");
      setCategory(editingProduct.category || "");
      setSubCategory(normalizeSubCategory(editingProduct.subCategory || ""));
      setPrice(editingProduct.price || "");
      setDiscount(editingProduct.discount || "");
      setSelectedSizes(editingProduct.sizes || []);
      setColourEntries(editingProduct.colours || [{ colour: "", image: "" }]);
      setBrand(editingProduct.brand || "");
      setStockQuantity(editingProduct.stockQuantity !== undefined ? editingProduct.stockQuantity : "");
      setSku(editingProduct.sku || "");
      setSpecifications(editingProduct.specifications || "");
      setWarranty(editingProduct.warranty || "");
      setSeller(editingProduct.seller || "");
    } else {
      setId("");
      setName("");
      setDescription("");
      setCategory("");
      setSubCategory("");
      setPrice("");
      setDiscount("");
      setSelectedSizes([]);
      setColourEntries([{ colour: "", image: "" }]);
      setBrand("");
      setStockQuantity("");
      setSku("");
      setSpecifications("");
      setWarranty("");
      setSeller("");
    }
  }, [editingProduct]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleSizeToggle = (sizeVal) => {
    if (selectedSizes.includes(sizeVal)) {
      setSelectedSizes(selectedSizes.filter(s => s !== sizeVal));
    } else {
      setSelectedSizes([...selectedSizes, sizeVal]);
    }
  };

  const handleColourChange = (index, field, value) => {
    const updated = colourEntries.map((item, idx) => idx === index ? { ...item, [field]: value } : item);
    setColourEntries(updated);
  };

  const addColourRow = () => {
    setColourEntries([...colourEntries, { colour: "", image: "" }]);
  };

  const removeColourRow = (index) => {
    if (colourEntries.length > 1) {
      setColourEntries(colourEntries.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isColourCategory = ["fashion", "accessories"].includes((category || "").toLowerCase().trim());
    const isFashion = (category || "").toLowerCase().trim() === "fashion";

    if (!id || !name || !category || !price) {
      showToast("Please fill all required fields (ID, Name, Category, Price).");
      return;
    }

    if (isColourCategory) {
      if (colourEntries.some(c => !c.colour || !c.image)) {
        showToast("Fashion and Accessories products require at least 1 colour and image mapping.");
        return;
      }
      if (isFashion && selectedSizes.length === 0) {
        showToast("Fashion products require at least 1 size.");
        return;
      }
    } else {
      if (colourEntries.some(c => !c.image)) {
        showToast("Please specify at least 1 image URL.");
        return;
      }
    }

    if (!isEditing && products.some(p => String(p.id) === String(id))) {
      showToast("Product ID already exists. Please choose a unique ID.");
      return;
    }

    const finalPrice = Math.round(parseFloat(price) * (1 - parseFloat(discount || 0) / 100));
    const activeColours = isColourCategory ? colourEntries : colourEntries.filter(c => c.image);

    const payload = {
      id: parseInt(id),
      name,
      description,
      category: category.toLowerCase(),
      subCategory: normalizeSubCategory(subCategory),
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      finalPrice: finalPrice,
      images: JSON.stringify(activeColours.map(c => c.image)),
      sizes: JSON.stringify(getSizeOptions(category, subCategory).length > 0 ? sortSizes(selectedSizes) : []),
      colours: JSON.stringify(activeColours),
      brand: brand,
      stockQuantity: stockQuantity === "" ? 0 : parseInt(stockQuantity),
      sku: sku,
      specifications: specifications,
      warranty: warranty,
      seller: seller,
      salesCount: editingProduct ? (editingProduct.salesCount !== undefined ? editingProduct.salesCount : 0) : 0,
      rating: editingProduct ? (editingProduct.rating !== undefined ? editingProduct.rating : 0.0) : 0.0,
      totalReviews: editingProduct ? (editingProduct.totalReviews !== undefined ? editingProduct.totalReviews : 0) : 0
    };

    console.log("Product Payload", payload);

    const url = isEditing ? `http://localhost:8080/products/${id}` : "http://localhost:8080/products";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to ${isEditing ? "update" : "add"} product in backend database.`);
        }
        return res.json();
      })
      .then((savedProduct) => {
        let parsedImages = [];
        try {
          parsedImages = typeof savedProduct.images === "string" ? JSON.parse(savedProduct.images) : savedProduct.images;
        } catch (e) {
          console.error(e);
        }
        let parsedSizes = [];
        try {
          parsedSizes = typeof savedProduct.sizes === "string" ? JSON.parse(savedProduct.sizes) : savedProduct.sizes;
        } catch (e) {
          console.error(e);
        }
        let parsedColours = [];
        try {
          parsedColours = typeof savedProduct.colours === "string" ? JSON.parse(savedProduct.colours) : savedProduct.colours;
        } catch (e) {
          console.error(e);
        }

        const formattedProduct = {
          ...savedProduct,
          images: parsedImages || [],
          sizes: parsedSizes || [],
          colours: parsedColours || [],
          brand: savedProduct.brand || "",
          stockQuantity: savedProduct.stockQuantity !== undefined ? savedProduct.stockQuantity : 0,
          sku: savedProduct.sku || "",
          specifications: savedProduct.specifications || "",
          warranty: savedProduct.warranty || "",
          seller: savedProduct.seller || "",
          salesCount: savedProduct.salesCount !== undefined ? savedProduct.salesCount : 0,
          rating: savedProduct.rating !== undefined ? savedProduct.rating : 0,
          totalReviews: savedProduct.totalReviews !== undefined ? savedProduct.totalReviews : 0,
          subCategory: savedProduct.subCategory || ""
        };

        if (isEditing) {
          setProducts(products.map(p => String(p.id) === String(editId) ? formattedProduct : p));
          showToast("Product updated successfully!");
        } else {
          setProducts([...products, formattedProduct]);
          showToast("Product added successfully!");
        }
        if (fetchProducts) {
          fetchProducts();
        }
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error(err);
        showToast(`Error saving product: ${err.message}`);
      });
  };

  return (
    <div className="address-container" style={{ maxWidth: "850px", margin: "2rem auto", padding: "2.5rem", backgroundColor: "white", borderRadius: "1rem", border: "2px solid #2563EB", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
          <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
          <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
        </Link>
      </div>
      <h2 style={{ textAlign: "center", color: "#2563EB", marginBottom: "1.5rem" }}>
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {/* Row 1: Product ID + Product Category */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Product ID *</label>
            <input
              type="number"
              placeholder="e.g. 19"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isEditing}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Product Category *</label>
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value;
                setCategory(newCat);
                setSubCategory("");
                setSelectedSizes([]);
                const isNewColCat = ["fashion", "accessories"].includes(newCat.toLowerCase().trim());
                if (!isNewColCat) {
                  setColourEntries([{ colour: "", image: colourEntries[0]?.image || "" }]);
                }
              }}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", backgroundColor: "white", boxSizing: "border-box" }}
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="home & kitchen">Home & Kitchen</option>
              <option value="accessories">Accessories</option>
              <option value="toys">Toys</option>
            </select>
          </div>
        </div>

        {/* Row: Sub Category layer */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {["fashion", "electronics", "books", "beauty"].includes((category || "").toLowerCase()) && (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontWeight: "600", color: "#555" }}>Product Sub Category *</label>
              <select
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setSelectedSizes([]);
                }}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", backgroundColor: "white", boxSizing: "border-box" }}
                required
              >
                <option value="">Select Sub Category</option>
                {category.toLowerCase() === "fashion" && (
                  <>
                    <option value="Shirts">Shirts</option>
                    <option value="Tops">Tops</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Kurti">Kurti</option>
                    <option value="Skirts">Skirts</option>
                    <option value="Jacket">Jacket</option>
                  </>
                )}
                {category.toLowerCase() === "electronics" && (
                  <>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Smart Watches">Smart Watches</option>
                    <option value="Charger">Charger</option>
                  </>
                )}
                {category.toLowerCase() === "books" && (
                  <>
                    <option value="Fiction">Fiction</option>
                    <option value="Non Fiction">Non Fiction</option>
                    <option value="Academic">Academic</option>
                    <option value="Self Help">Self Help</option>
                  </>
                )}
                {category.toLowerCase() === "beauty" && (
                  <>
                    <option value="Makeup">Makeup</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                  </>
                )}
              </select>
            </div>
          )}
          {!["fashion", "electronics", "books", "beauty"].includes((category || "").toLowerCase()) && category && (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontWeight: "600", color: "#555" }}>Product Sub Category</label>
              <input
                type="text"
                placeholder="e.g. Football, Cookware"
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setSelectedSizes([]);
                }}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
              />
            </div>
          )}
        </div>

        {/* Row: Brand/Author + Stock Quantity */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>{(category || "").toLowerCase() === "books" ? "Author" : "Brand"} *</label>
            <input
              type="text"
              placeholder={(category || "").toLowerCase() === "books" ? "e.g. J.K. Rowling" : "e.g. Nike, Apple"}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
              required
            />
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Stock Quantity *</label>
            <input
              type="number"
              placeholder="e.g. 24"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
              required
            />
          </div>
        </div>

        {/* Row 2: Product Name */}
        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Product Name *</label>
          <input
            type="text"
            placeholder="e.g. Pink Dress"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
          />
        </div>

        {/* Row 3: Product Description */}
        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Product Description</label>
          <textarea
            placeholder="Enter elegant details about this style..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", minHeight: "80px", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>

        {/* Row: SKU + Seller + Warranty */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>SKU</label>
            <input
              type="text"
              placeholder="e.g. ELEC-IPHONE13"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Seller</label>
            <input
              type="text"
              placeholder="e.g. RetailNet"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Warranty</label>
            <input
              type="text"
              placeholder="e.g. 1 Year Brand Warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Row: Specifications */}
        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Specifications</label>
          <textarea
            placeholder="e.g. Display: 6.1 inches&#10;Camera: 12 MP + 12 MP&#10;Processor: A15 Bionic"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", minHeight: "80px", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>

        {/* Row 4: Product Price + Product Discount */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Product Price (₹) *</label>
            <input
              type="number"
              placeholder="e.g. 1499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Product Discount (%)</label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Row 5: Available Sizes + Colours */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {getSizeOptions(category, subCategory).length > 0 && (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontWeight: "600", color: "#555" }}>
                {category.toLowerCase() === "electronics" ? "Available Storage Options *" :
                  category.toLowerCase() === "beauty" ? "Available Volumes *" :
                    "Available Sizes *"}
              </label>
              <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {getSizeOptions(category, subCategory).map((sz) => (
                  <label key={sz} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: "600" }}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(sz)}
                      onChange={() => handleSizeToggle(sz)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    {sz}
                  </label>
                ))}
              </div>
            </div>
          )}

          {["fashion", "accessories"].includes((category || "").toLowerCase().trim()) ? (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontWeight: "600", color: "#555" }}>Product Colours & Separate Images *</label>
              <div style={{ display: "flex", gap: "0.8rem", flexDirection: "column", marginTop: "0.5rem" }}>
                {colourEntries.map((row, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Colour (e.g. Blue)"
                      value={row.colour}
                      onChange={(e) => handleColourChange(idx, "colour", e.target.value)}
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc", boxSizing: "border-box" }}
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={row.image}
                      onChange={(e) => handleColourChange(idx, "image", e.target.value)}
                      style={{ flex: 2, padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc", boxSizing: "border-box" }}
                    />
                    {colourEntries.length > 1 && (
                      <button type="button" onClick={() => removeColourRow(idx)} className="remove-button" style={{ marginTop: 0, padding: "0.4rem 0.8rem" }}>Delete</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addColourRow} style={{ backgroundColor: "#9333ea", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", alignSelf: "flex-start" }}>
                  <LuPlus /> Add Colour Option
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontWeight: "600", color: "#555" }}>Product Image URL *</label>
              <input
                type="text"
                placeholder="e.g. /images/product.png or HTTPS URL"
                value={colourEntries[0]?.image || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setColourEntries([{ colour: "", image: val }]);
                }}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.3rem", boxSizing: "border-box" }}
                required
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" className="confirm-button" style={{ flex: 1, backgroundColor: "#2563EB" }}>
            {isEditing ? "Save Changes" : "Submit"}
          </button>
          <button type="button" onClick={() => navigate("/admin-dashboard")} className="remove-button" style={{ flex: 1, marginTop: 0 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function AdminDashboardPage({ user, products, setProducts, fetchProducts, cart, wishlist }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0 });
  const [activeTab, setActiveTab] = useState("analytics"); // Default to analytics for overview
  const [isRegExpanded, setIsRegExpanded] = useState(false); // Collapsible registration state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [customerAnalytics, setCustomerAnalytics] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [userSummary, setUserSummary] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkDiscountModal, setShowBulkDiscountModal] = useState(false);
  const [bulkDiscountValue, setBulkDiscountValue] = useState("");
  const [bulkDiscountType, setBulkDiscountType] = useState("PERCENT"); // "PERCENT" or "FLAT"

  const handleBulkDiscountSubmit = async () => {
    const val = parseFloat(bulkDiscountValue);
    if (isNaN(val) || val < 0) {
      showToast("Please enter a valid positive number for discount.");
      return;
    }

    const payload = {
      productIds: selectedProducts,
      discount: val,
      discountType: bulkDiscountType
    };

    try {
      const res = await fetch("http://localhost:8080/products/bulk-discount", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to apply bulk discount");
      }

      showToast("Bulk discount applied successfully!");
      setShowBulkDiscountModal(false);
      setBulkDiscountValue("");
      setSelectedProducts([]);

      if (fetchProducts) {
        fetchProducts();
      }
    } catch (err) {
      showToast("Error: " + err.message);
    }
  };

  const fetchAllOrders = () => {
    fetch("http://localhost:8080/orders")
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(order => ({
          ...order,
          items: order.items.map(item => {
            let parsedImages = [];
            try {
              parsedImages = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
            } catch (e) {
              console.error(e);
            }
            return {
              ...item,
              images: parsedImages || []
            };
          })
        }));
        setAllOrders(parsed);
      })
      .catch(err => console.error("Error loading orders:", err));
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    fetch("http://localhost:8080/dashboard/stats")
      .then((res) => {
        if (!res.ok)
          throw new Error("Failed to fetch dashboard stats");

        return res.json();
      })
      .then((data) => {

        console.log("Dashboard Stats:", data);

        setStats(data);

      })
      .catch((err) =>
        console.error(
          "Error fetching dashboard stats:",
          err
        )
      );

    if (activeTab === "orders") {
      fetchAllOrders();
    }

    if (activeTab === "analytics") {
      fetch("http://localhost:8080/analytics/dashboard")
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch analytics");
          return res.json();
        })
        .then(data => setAnalyticsData(data))
        .catch(err => console.error("Error fetching analytics:", err));

      fetch("http://localhost:8080/analytics/monthly-revenue")
        .then(res => res.ok ? res.json() : [])
        .then(data => setMonthlyRevenue(data))
        .catch(err => console.error("Error fetching monthly revenue:", err));

      fetch("http://localhost:8080/analytics/monthly-orders")
        .then(res => res.ok ? res.json() : [])
        .then(data => setMonthlyOrders(data))
        .catch(err => console.error("Error fetching monthly orders:", err));

      fetch("http://localhost:8080/analytics/category-distribution")
        .then(res => res.ok ? res.json() : [])
        .then(data => setCategoryDistribution(data))
        .catch(err => console.error("Error fetching category distribution:", err));

      fetch("http://localhost:8080/analytics/customer-analytics")
        .then(res => res.ok ? res.json() : null)
        .then(data => setCustomerAnalytics(data))
        .catch(err => console.error("Error fetching customer analytics:", err));

      fetch("http://localhost:8080/analytics/low-stock")
        .then(res => res.ok ? res.json() : [])
        .then(data => setLowStockProducts(data))
        .catch(err => console.error("Error fetching low stock products:", err));

      fetch("http://localhost:8080/analytics/admin/monthly-registrations")
        .then(res => res.ok ? res.json() : [])
        .then(data => setMonthlyRegistrations(data))
        .catch(err => console.error("Error fetching monthly registrations:", err));

      fetch("http://localhost:8080/analytics/admin/user-summary")
        .then(res => res.ok ? res.json() : null)
        .then(data => setUserSummary(data))
        .catch(err => console.error("Error fetching user summary:", err));
    }
  }, [user, products, navigate, activeTab]);

  const handleItemStatusUpdate = async (itemId, newStatus, orderId) => {
    try {
      const res = await fetch(`http://localhost:8080/orders/item/${itemId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update item status");

      if (orderId) {
        const orderRes = await fetch(`http://localhost:8080/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (!orderRes.ok) throw new Error("Failed to update order status");
      }

      showToast("Item status updated successfully!");
      fetchAllOrders();

      // Update stats
      fetch("http://localhost:8080/dashboard/stats")
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    } catch (err) {
      showToast("Error: " + err.message);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete product from backend database.");
          }
          const updated = products.filter(p => String(p.id) !== String(id));
          setProducts(updated);
          showToast("Product deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
          showToast("Error deleting product: " + err.message);
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/add-product?edit=${id}`);
  };

  // Process User Registration Analytics insights
  let highestRegMonth = "—";
  let averageRegistrations = "0";
  let growthText = "—";
  let growthColor = "#2563EB";

  if (monthlyRegistrations && monthlyRegistrations.length > 0) {
    // 1. Highest Registration Month
    let maxMonth = null;
    let maxCount = -1;
    monthlyRegistrations.forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        maxMonth = item.month;
      }
    });
    if (maxMonth && maxCount > 0) {
      highestRegMonth = maxMonth.charAt(0) + maxMonth.slice(1).toLowerCase() + ` (${maxCount} users)`;
    } else if (maxCount === 0) {
      highestRegMonth = "No registrations";
    }

    // 2. Average Monthly Registrations
    const totalCount = monthlyRegistrations.reduce((sum, item) => sum + (item.count || 0), 0);
    averageRegistrations = (totalCount / monthlyRegistrations.length).toFixed(1);

    // 3. Growth Compared To Previous Month
    const todayDate = new Date();
    const currentMonthIdx = todayDate.getMonth(); // 0-11
    const prevMonthIdx = (currentMonthIdx - 1 + 12) % 12;

    const monthNames = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const currentMonthName = monthNames[currentMonthIdx];
    const prevMonthName = monthNames[prevMonthIdx];

    const currentMonthData = monthlyRegistrations.find(item => item.month === currentMonthName);
    const prevMonthData = monthlyRegistrations.find(item => item.month === prevMonthName);

    const currentCount = currentMonthData ? (currentMonthData.count || 0) : 0;
    const prevCount = prevMonthData ? (prevMonthData.count || 0) : 0;

    if (prevCount > 0) {
      const growthVal = ((currentCount - prevCount) / prevCount) * 100;
      const sign = growthVal > 0 ? "+" : "";
      growthText = `${sign}${growthVal.toFixed(1)}%`;
      growthColor = growthVal > 0 ? "#10B981" : growthVal < 0 ? "#EF4444" : "#2563EB";
    } else {
      if (currentCount > 0) {
        growthText = `+100.0%`;
        growthColor = "#10B981";
      } else {
        growthText = "0.0% (No change)";
        growthColor = "#2563EB";
      }
    }
  }

  return (
    <div className="glass-dashboard-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", borderRight: "2px solid #DBEAFE", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem", backgroundColor: "white" }}>
        <h2 style={{ color: "#2563EB", fontSize: "1.5rem", margin: 0, fontWeight: "bold" }}>Trendy Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={() => setActiveTab("products")} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: activeTab === "products" ? "#DBEAFE" : "transparent", color: activeTab === "products" ? "#2563EB" : "#666", fontWeight: "bold", textAlign: "left", cursor: "pointer", width: "100%" }}>
            <LuChartLine /> Manage Products
          </button>
          <button onClick={() => setActiveTab("orders")} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: activeTab === "orders" ? "#DBEAFE" : "transparent", color: activeTab === "orders" ? "#2563EB" : "#666", fontWeight: "bold", textAlign: "left", cursor: "pointer", width: "100%" }}>
            <LuPackage /> Manage Orders
          </button>
          <button onClick={() => setActiveTab("analytics")} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: activeTab === "analytics" ? "#DBEAFE" : "transparent", color: activeTab === "analytics" ? "#2563EB" : "#666", fontWeight: "bold", textAlign: "left", cursor: "pointer", width: "100%" }}>
            <LuTrendingUp /> Analytics
          </button>
          <button onClick={() => navigate("/add-product")} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "transparent", color: "#666", fontWeight: "600", textAlign: "left", cursor: "pointer", width: "100%" }}>
            <LuPlus /> Add Product
          </button>
          <button onClick={() => navigate("/")} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "transparent", color: "#666", fontWeight: "600", textAlign: "left", cursor: "pointer", width: "100%" }}>
            🏠 Store Front
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2.5rem" }}>
        {/* Top Heading */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
                <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
              </button>
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
                <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
              </Link>
            </div>
            <h1 style={{ color: "#2563EB", margin: 0, fontSize: "2.2rem" }}>Admin Dashboard</h1>
            <p style={{ color: "#666", margin: "0.25rem 0 0 0" }}>Manage your catalog and view store analytics</p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="confirm-button"
            style={{ backgroundColor: "#2563EB", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}
          >
            <LuPlus /> Add Product
          </button>
        </div>

        {/* Dashboard Cards */}
        {activeTab === "analytics" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Revenue</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>₹{analyticsData ? Number(analyticsData.totalRevenue).toLocaleString("en-IN") : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}><LuWallet /></span>
            </div>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Orders</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>{analyticsData ? analyticsData.totalOrders : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}><LuShoppingCart /></span>
            </div>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Products</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>{analyticsData ? analyticsData.totalProducts : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}><LuPackage /></span>
            </div>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Users</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>{analyticsData ? analyticsData.totalUsers : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}>👥</span>
            </div>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Revenue Month</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>₹{analyticsData && analyticsData.revenueThisMonth != null ? Number(analyticsData.revenueThisMonth).toLocaleString("en-IN") : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}>📅</span>
            </div>
            <div className="glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600", fontSize: "0.8rem" }}>Orders Month</p>
                <h3 style={{ color: "#2563EB", fontSize: "1.3rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>{analyticsData && analyticsData.ordersThisMonth != null ? analyticsData.ordersThisMonth : "—"}</h3>
              </div>
              <span style={{ fontSize: "1.8rem", color: "#2563EB" }}>📨</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Total Products</p>
                <h3 style={{ color: "#2563EB", fontSize: "2rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>{products.length}</h3>
              </div>
              <span style={{ fontSize: "2.5rem" }}><LuPackage /></span>
            </div>
            <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Total Users</p>
                <h3 style={{ color: "#2563EB", fontSize: "2rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>{stats.totalUsers}</h3>
              </div>
              <span style={{ fontSize: "2.5rem" }}>👥</span>
            </div>
            <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Total Orders</p>
                <h3 style={{ color: "#2563EB", fontSize: "2rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>{stats.totalOrders}</h3>
              </div>
              <span style={{ fontSize: "2.5rem" }}><LuShoppingCart /></span>
            </div>
          </div>
        )}

        {activeTab === "analytics" ? (
          /* Analytics Dashboard */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Section 2: Business Performance Side-by-Side Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
              {/* Monthly Revenue Trend - Line Chart */}
              <div className="glass-card" style={{ padding: "1.25rem" }}>
                <h2 style={{ color: "#333", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem", fontWeight: "bold" }}>
                  <span><LuTrendingUp /></span> Monthly Revenue Trend
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#666" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#666" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Orders Trend - Bar Chart */}
              <div className="glass-card" style={{ padding: "1.25rem" }}>
                <h2 style={{ color: "#333", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem", fontWeight: "bold" }}>
                  <span><LuChartLine /></span> Monthly Orders Trend
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#666" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#666" }} />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                    <Legend />
                    <Bar dataKey="orders" fill="#2563EB" radius={[4, 4, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section 4: Product Analytics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
              {/* Top Selling Products */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span><LuTrophy /></span> Top Selling Products
                </h2>
                <div style={{ overflowX: "auto", flex: 1 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                        <th style={{ padding: "0.5rem", color: "#555" }}>#</th>
                        <th style={{ padding: "0.5rem", color: "#555" }}>Product Name</th>
                        <th style={{ padding: "0.5rem", color: "#555", textAlign: "center" }}>Sales</th>
                        <th style={{ padding: "0.5rem", color: "#555", textAlign: "center" }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData && analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
                        analyticsData.topProducts.slice(0, 5).map((p, idx) => (
                          <tr key={p.id || idx} style={{ borderBottom: "1px solid #DBEAFE" }}>
                            <td style={{ padding: "0.5rem", fontWeight: "bold", color: "#2563EB" }}>{idx + 1}</td>
                            <td style={{ padding: "0.5rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }} title={p.name}>{p.name}</td>
                            <td style={{ padding: "0.5rem", textAlign: "center" }}>
                              <span style={{ backgroundColor: "#fdf2f8", color: "#2563EB", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: "bold", fontSize: "0.8rem" }}>{p.salesCount ?? 0}</span>
                            </td>
                            <td style={{ padding: "0.5rem", textAlign: "center" }}>
                              <span style={{ color: (p.stockQuantity ?? p.stock ?? 0) === 0 ? "#ef4444" : (p.stockQuantity ?? p.stock ?? 0) <= 10 ? "#d97706" : "#059669", fontWeight: "bold" }}>
                                {(p.stockQuantity ?? p.stock ?? 0) === 0 ? "Out of Stock" : (p.stockQuantity ?? p.stock ?? 0)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "#999" }}>No data available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Distribution - Pie Chart */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>🧩</span> Category Distribution
                </h2>
                <div style={{ flex: 1, minHeight: "260px" }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        dataKey="sales"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={45}
                        paddingAngle={3}
                        label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={index} fill={["#2563EB", "#f472b6", "#10B981", "#be185d", "#9d174d", "#831843", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"][index % 10]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Section 3 & Tables: Customer & Category Analytics Grid (3-Column Layout) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {/* Customer Analytics Card */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>👥</span> Customer Analytics
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", flex: 1 }}>
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.75rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ color: "#666", fontSize: "0.75rem", fontWeight: "600" }}>Total Customers</span>
                    <span style={{ color: "#2563EB", fontSize: "1.25rem", fontWeight: "bold", marginTop: "0.25rem" }}>
                      {customerAnalytics ? customerAnalytics.totalCustomers : "—"}
                    </span>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.75rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ color: "#666", fontSize: "0.75rem", fontWeight: "600" }}>Repeat Customers</span>
                    <span style={{ color: "#2563EB", fontSize: "1.25rem", fontWeight: "bold", marginTop: "0.25rem" }}>
                      {customerAnalytics ? customerAnalytics.repeatCustomers : "—"}
                    </span>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.75rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ color: "#666", fontSize: "0.75rem", fontWeight: "600" }}>Avg Order Value</span>
                    <span style={{ color: "#2563EB", fontSize: "1.25rem", fontWeight: "bold", marginTop: "0.25rem" }}>
                      ₹{customerAnalytics && customerAnalytics.averageOrderValue != null ? Number(customerAnalytics.averageOrderValue).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "—"}
                    </span>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.75rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ color: "#666", fontSize: "0.75rem", fontWeight: "600" }}>Top Customer</span>
                    <span style={{ color: "#10B981", fontSize: "1.05rem", fontWeight: "bold", marginTop: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={customerAnalytics && customerAnalytics.topCustomers && customerAnalytics.topCustomers.length > 0 ? `User ID: ${customerAnalytics.topCustomers[0].userId} spent ₹${Number(customerAnalytics.topCustomers[0].totalSpent).toLocaleString("en-IN")}` : ""}>
                      {customerAnalytics && customerAnalytics.topCustomers && customerAnalytics.topCustomers.length > 0 ? (
                        `User #${customerAnalytics.topCustomers[0].userId} (₹${Math.round(customerAnalytics.topCustomers[0].totalSpent)})`
                      ) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Customers Card */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span><LuStar fill="#facc15" color="#facc15" /></span> Top Customers
                </h2>
                <div style={{ overflowX: "auto", flex: 1 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                        <th style={{ padding: "0.5rem", color: "#555" }}>User ID</th>
                        <th style={{ padding: "0.5rem", color: "#555", textAlign: "right" }}>Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerAnalytics && customerAnalytics.topCustomers && customerAnalytics.topCustomers.length > 0 ? (
                        customerAnalytics.topCustomers.slice(0, 5).map((cust, idx) => (
                          <tr key={cust.userId || idx} style={{ borderBottom: "1px solid #DBEAFE" }}>
                            <td style={{ padding: "0.5rem", fontWeight: "bold", color: "#2563EB" }}>User #{cust.userId}</td>
                            <td style={{ padding: "0.5rem", textAlign: "right", fontWeight: "bold" }}>
                              ₹{Number(cust.totalSpent || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="2" style={{ padding: "1rem", textAlign: "center", color: "#999" }}>No customer data available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Most Purchased Categories Table */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span><LuShoppingBag /></span> Most Purchased Categories
                </h2>
                <div style={{ overflowX: "auto", flex: 1 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                        <th style={{ padding: "0.5rem", color: "#555" }}>Category</th>
                        <th style={{ padding: "0.5rem", color: "#555", textAlign: "center" }}>Sales Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerAnalytics && customerAnalytics.topCategories && customerAnalytics.topCategories.length > 0 ? (
                        customerAnalytics.topCategories.slice(0, 5).map((cat, idx) => (
                          <tr key={cat.category || idx} style={{ borderBottom: "1px solid #DBEAFE" }}>
                            <td style={{ padding: "0.5rem", fontWeight: "600", textTransform: "capitalize" }}>{cat.category}</td>
                            <td style={{ padding: "0.5rem", textAlign: "center" }}>
                              <span style={{ backgroundColor: "#fdf2f8", color: "#2563EB", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: "bold", fontSize: "0.75rem" }}>
                                {cat.sales ?? 0}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="2" style={{ padding: "1rem", textAlign: "center", color: "#999" }}>No category data available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Collapsible User Registration Section */}
            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setIsRegExpanded(!isRegExpanded)}>
                <h2 style={{ color: "#2563EB", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>📊</span> User Registration Analytics
                </h2>
                <button style={{ background: "none", border: "none", color: "#2563EB", fontWeight: "bold", cursor: "pointer", fontSize: "0.9rem" }}>
                  {isRegExpanded ? "Collapse ▲" : "Expand ▼"}
                </button>
              </div>

              {isRegExpanded && (
                <div style={{ marginTop: "1.25rem", borderTop: "1px solid #DBEAFE", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* KPI Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    {/* Total Users */}
                    <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "1rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ color: "#666", fontSize: "0.8rem", fontWeight: "600" }}>Total Users</span>
                        <h4 style={{ color: "#2563EB", fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>
                          {userSummary ? userSummary.totalUsers : "—"}
                        </h4>
                      </div>
                      <span style={{ fontSize: "1.8rem" }}>👥</span>
                    </div>

                    {/* Users Registered This Month */}
                    <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "1rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ color: "#666", fontSize: "0.8rem", fontWeight: "600" }}>Registered This Month</span>
                        <h4 style={{ color: "#2563EB", fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: "bold" }}>
                          {userSummary ? userSummary.thisMonthUsers : "—"}
                        </h4>
                      </div>
                      <span style={{ fontSize: "1.8rem" }}>📅</span>
                    </div>
                  </div>

                  {/* Chart & Insights Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {/* Chart */}
                    <div style={{ minWidth: "300px" }}>
                      <span style={{ color: "#333", fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "0.75rem" }}>Monthly Registration Chart</span>
                      <div style={{ width: "100%", height: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyRegistrations}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#666" }} tickFormatter={(m) => m ? m.substring(0, 3) : ""} />
                            <YAxis tick={{ fontSize: 10, fill: "#666" }} allowDecimals={false} />
                            <Tooltip formatter={(value) => [value, "Users"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                            <Legend />
                            <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Users" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Insights Panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <span style={{ color: "#333", fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>Insights</span>
                      
                      <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
                        <div style={{ color: "#64748B", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Highest Reg Month</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1E293B", marginTop: "2px" }}>
                          {highestRegMonth}
                        </div>
                      </div>

                      <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
                        <div style={{ color: "#64748B", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Avg Monthly Regs</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1E293B", marginTop: "2px" }}>
                          {averageRegistrations}
                        </div>
                      </div>

                      <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #DBEAFE", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
                        <div style={{ color: "#64748B", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Growth vs Prev Month</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: growthColor, marginTop: "2px" }}>
                          {growthText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Low Stock Alerts & Export Reports Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
              {/* Low Stock Alerts */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span><LuTriangleAlert /></span> Low Stock Alerts
                </h2>
                <div style={{ maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "0.25rem" }}>
                  {lowStockProducts && lowStockProducts.length > 0 ? (
                    lowStockProducts.map((p, idx) => {
                      let statusText = "";
                      let statusColor = "";
                      let statusBg = "";
                      let borderColor = "";

                      if (p.stock === 0) {
                        statusText = "Out Of Stock";
                        statusColor = "#dc2626";
                        statusBg = "#fee2e2";
                        borderColor = "#fecaca";
                      } else if (p.stock >= 1 && p.stock <= 2) {
                        statusText = "Critical Stock";
                        statusColor = "#ea580c";
                        statusBg = "#ffedd5";
                        borderColor = "#fed7aa";
                      } else {
                        statusText = "Low Stock";
                        statusColor = "#ca8a04";
                        statusBg = "#fef9c3";
                        borderColor = "#fef08a";
                      }

                      return (
                        <div key={p.id || idx} style={{
                          border: `1px solid ${borderColor}`,
                          backgroundColor: statusBg,
                          borderRadius: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.85rem"
                        }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: "bold", color: "#333" }}>{p.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "#666", textTransform: "capitalize" }}>{p.category} • {p.stock ?? 0} left</span>
                          </div>
                          <span style={{
                            backgroundColor: "white",
                            color: statusColor,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "9999px",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            border: `1px solid ${borderColor}`
                          }}>
                            {statusText}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: "1rem", textAlign: "center", color: "#155724", backgroundColor: "#d4edda", borderRadius: "0.5rem", border: "1px solid #c3e6cb", fontSize: "0.9rem" }}>
                      💚 All products are well stocked!
                    </div>
                  )}
                </div>
              </div>

              {/* Export Reports Utility Card */}
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <h2 style={{ color: "#2563EB", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>📥</span> Export Reports
                </h2>
                <p style={{ color: "#666", fontSize: "0.85rem", margin: "0 0 1rem 0" }}>Download store reports in Excel format.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, justifyContent: "center" }}>
                  {[
                    { label: "Export Orders", url: "http://localhost:8080/reports/orders/excel", icon: <LuPackage /> },
                    { label: "Export Inventory", url: "http://localhost:8080/reports/inventory/excel", icon: "📋" },
                    { label: "Export Revenue", url: "http://localhost:8080/reports/revenue/excel", icon: <LuWallet /> }
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = btn.url;
                        a.download = "";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.5rem 1rem", borderRadius: "0.5rem",
                        border: "2px solid #2563EB", backgroundColor: "#fdf2f8",
                        color: "#2563EB", fontWeight: "bold", fontSize: "0.85rem",
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = "#2563EB"; e.target.style.color = "white"; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = "#fdf2f8"; e.target.style.color = "#2563EB"; }}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ color: "#2563EB", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>🕐</span> Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#2563EB",
                    border: "1px solid #2563EB",
                    borderRadius: "0.5rem",
                    padding: "0.4rem 0.8rem",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  View All Orders
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                      <th style={{ padding: "0.5rem", color: "#555" }}>Order ID</th>
                      <th style={{ padding: "0.5rem", color: "#555" }}>Customer ID</th>
                      <th style={{ padding: "0.5rem", color: "#555", textAlign: "right" }}>Amount</th>
                      <th style={{ padding: "0.5rem", color: "#555", textAlign: "center" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData && analyticsData.recentOrders && analyticsData.recentOrders.length > 0 ? (
                      analyticsData.recentOrders.slice(0, 5).map((o, idx) => (
                        <tr key={o.id || idx} style={{ borderBottom: "1px solid #DBEAFE" }}>
                          <td style={{ padding: "0.5rem", fontWeight: "bold" }}>#{o.id}</td>
                          <td style={{ padding: "0.5rem" }}>{o.userId || o.customerId || "Guest"}</td>
                          <td style={{ padding: "0.5rem", textAlign: "right", fontWeight: "bold" }}>₹{Number(o.totalAmount || o.amount || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "0.5rem", textAlign: "center" }}>
                            <span style={{
                              padding: "0.15rem 0.5rem",
                              borderRadius: "9999px",
                              fontWeight: "bold",
                              fontSize: "0.75rem",
                              backgroundColor:
                                (o.status || "") === "Delivered" ? "#d1fae5" :
                                  (o.status || "") === "Cancelled" ? "#fee2e2" :
                                    (o.status || "").includes("Transit") || (o.status || "").includes("Shipped") ? "#dbeafe" :
                                      "#fef3c7",
                              color:
                                (o.status || "") === "Delivered" ? "#065f46" :
                                  (o.status || "") === "Cancelled" ? "#991b1b" :
                                    (o.status || "").includes("Transit") || (o.status || "").includes("Shipped") ? "#1e40af" :
                                      "#92400e"
                            }}>
                              {o.status || "Processing"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>No recent orders</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "orders" ? (
          /* Manage Orders List/Table */
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "#333", margin: "0 0 1.5rem 0" }}>Manage Orders</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Order ID</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>User ID</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Date</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Items</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Total Amount</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Status</th>
                    <th style={{ padding: "0.75rem", color: "#555", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #DBEAFE" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "bold" }}>#{o.id}</td>
                      <td style={{ padding: "0.75rem" }}>{o.userId || "Guest"}</td>
                      <td style={{ padding: "0.75rem" }}>{o.date}</td>
                      <td style={{ padding: "0.75rem" }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem", borderBottom: idx < o.items.length - 1 ? "1px dashed #eee" : "none", paddingBottom: "0.25rem" }}>
                            <strong>{item.name}</strong> (Qty: {item.quantity}, Size: {item.size}, Color: {item.color})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "0.75rem", fontWeight: "bold" }}>₹{o.totalAmount}</td>
                      <td style={{ padding: "0.75rem" }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: "0.85rem", marginBottom: "0.5rem", borderBottom: idx < o.items.length - 1 ? "1px dashed #eee" : "none", paddingBottom: "0.25rem" }}>
                            <span style={{
                              color: item.status === "Delivered" ? "#10b981" :
                                item.status === "Cancelled" ? "#ef4444" :
                                  item.status === "Exchanged" ? "#3b82f6" : "#f59e0b",
                              fontWeight: "bold"
                            }}>{item.status || "Preparing Your Order"}</span>
                            {item.exchangeRequested && item.exchangeReason && (
                              <div style={{ fontSize: "0.7rem", color: "#6b7280", fontStyle: "italic", marginTop: "2px" }}>
                                Reason: {item.exchangeReason}
                              </div>
                            )}
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: "0.5rem", borderBottom: idx < o.items.length - 1 ? "1px dashed #eee" : "none", paddingBottom: "0.25rem" }}>
                            <select
                              value={item.status || "Preparing Your Order"}
                              onChange={(e) => handleItemStatusUpdate(item.id, e.target.value, o.id)}
                              style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#fff", fontSize: "0.8rem" }}
                            >
                              <option value="Preparing Your Order">Preparing Your Order</option>
                              <option value="Packed">Packed</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out For Delivery">Out For Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Unable To Deliver">Unable To Deliver</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Exchanged">Exchanged</option>
                            </select>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Product List/Table */
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#333", margin: 0 }}>Manage Products</h2>
              <button
                onClick={() => {
                  if (selectedProducts.length === 0) {
                    showToast("Please select at least one product using the checkboxes.");
                    return;
                  }
                  setShowBulkDiscountModal(true);
                }}
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s"
                }}
              >
                Give Discount {selectedProducts.length > 0 ? `(${selectedProducts.length})` : ""}
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                    <th style={{ padding: "0.75rem", color: "#555", width: "40px", textAlign: "center" }}>Select</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Image</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>ID</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Name</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Colour</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Price (₹)</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Size</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Discount</th>
                    <th style={{ padding: "0.75rem", color: "#555" }}>Stock</th>
                    <th style={{ padding: "0.75rem", color: "#555", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    let imgSrc = Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'object' && p.images !== null ? Object.values(p.images)[0] : p.images);
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid #DBEAFE" }}>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, p.id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                              }
                            }}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <img src={imgSrc} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "0.5rem" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100"; }} />
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "bold" }}>{p.id}</td>
                        <td style={{ padding: "0.75rem" }}>{p.name}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                            {p.colours && p.colours.length > 0 ? (
                              p.colours.map((col, idx) => (
                                <ColorSwatch key={idx} colourName={col.colour || col.color} showNameAlways={true} />
                              ))
                            ) : (
                              <ColorSwatch colourName={p.color || "Default"} showNameAlways={true} />
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>₹{p.price}</td>
                        <td style={{ padding: "0.75rem" }}>{formatAndSortSizes(p.sizes || p.size)}</td>
                        <td style={{ padding: "0.75rem" }}>{p.discount ? (p.discountType === "FLAT" ? `₹${p.discount}` : `${p.discount}%`) : "0%"}</td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                          {p.stockQuantity === 0 ? (
                            <span style={{ color: "#ef4444" }}>Out of Stock</span>
                          ) : (
                            <span>{p.stockQuantity !== undefined ? p.stockQuantity : 0}</span>
                          )}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                            <button onClick={() => handleEdit(p.id)} style={{ padding: "0.4rem 0.8rem", border: "1px solid #3b82f6", borderRadius: "4px", backgroundColor: "#eff6ff", color: "#1d4ed8", cursor: "pointer", fontSize: "0.85rem" }}>
                              <LuPencil /> Edit
                            </button>
                            <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: "0.4rem 0.8rem", border: "1px solid #ef4444", borderRadius: "4px", backgroundColor: "#fef2f2", color: "#b91c1c", cursor: "pointer", fontSize: "0.85rem" }}>
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
          </div>
        )}
      </div>

      {showBulkDiscountModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "white",
            border: "2px solid #DBEAFE",
            borderRadius: "1rem",
            padding: "2.5rem",
            width: "400px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            fontFamily: "Segoe UI, sans-serif"
          }}>
            <h3 style={{ color: "#2563EB", margin: "0 0 1.5rem 0", fontSize: "1.3rem", fontWeight: "bold" }}>Apply Bulk Discount</h3>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Applying discount to <strong>{selectedProducts.length}</strong> selected products.
            </p>

            <div style={{ display: "flex", gap: "1.2rem", flexDirection: "column" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#555" }}>Discount Value</label>
                <input
                  type="number"
                  value={bulkDiscountValue}
                  onChange={(e) => setBulkDiscountValue(e.target.value)}
                  placeholder="e.g. 10"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#555" }}>Discount Type</label>
                <select
                  value={bulkDiscountType}
                  onChange={(e) => setBulkDiscountType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    backgroundColor: "white",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="PERCENT">% OFF</option>
                  <option value="FLAT">₹ OFF</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  onClick={handleBulkDiscountSubmit}
                  style={{
                    flex: 1,
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowBulkDiscountModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseTrackerPage({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/analytics/expense-tracker/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expense analytics");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "3rem", textAlign: "center", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ color: "#2563EB", margin: "1.5rem 0 1rem 0" }}>Access Denied</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Please log in to view your Expense Tracker and analyze your platform spending.</p>
          <button onClick={() => navigate("/login")} className="confirm-button" style={{ backgroundColor: "#2563EB", width: "100%" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const categoryData = data && data.categorySpending ?
    Object.entries(data.categorySpending).map(([category, amount]) => ({ name: category, value: Math.round(amount) })) : [];

  const brandData = data && data.brandSpending ?
    Object.entries(data.brandSpending).map(([brand, amount]) => ({ name: brand, value: Math.round(amount) })) : [];

  const monthlyData = data && data.monthlyTrend ?
    Object.entries(data.monthlyTrend).map(([month, amount]) => ({ name: month, amount: Math.round(amount) })) : [];

  return (
    <div className="glass-dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "white", borderBottom: "2px solid #DBEAFE" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link>
          <h1 style={{ color: "#2563EB", margin: 0, fontSize: "1.8rem", fontWeight: "bold", marginLeft: "0.5rem" }}>Expense Tracker</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineHome />
          </Link>
          <Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div>
          </Link>
          <Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div>
          </Link>
          <Link to="/expense-tracker" className="home-icon" title="Expense Tracker" style={{ display: "inline-flex", alignItems: "center", color: "#2563EB" }}>
            <MdOutlineInsights />
          </Link>
          <Link to="/profile" className="home-icon" title="Profile" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlinePerson />
          </Link>
          <Link to="/achievements" className="home-icon" title="Achievements" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineEmojiEvents />
          </Link>
          <Link to="/shopping-intelligence" className="home-icon" title="Shopping Intelligence" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdQueryStats />
          </Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          <button
            onClick={handleLogout}
            className="logout-button"
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#dc3545", color: "white" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem", color: "#2563EB", fontWeight: "bold" }}>
            Analyzing purchase history...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "1rem", border: "2px solid #fca5a5" }}>
            <h3>Error loading analytics</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Analytics banners */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {/* Smart Shopping Insights Banner Link */}
              <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", border: "1px dashed #2563EB" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h4 style={{ margin: 0, color: "#7c3aed", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>💡</span> Smart Shopping Insights
                  </h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                    Analyze category preferences, brand loyalty, and highest spending month patterns.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/shopping-insights")}
                  style={{
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    marginTop: "0.5rem"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#7c3aed"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#8b5cf6"}
                >
                  View Smart Insights
                </button>
              </div>

              {/* Personality Insights Banner Link */}
              <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", border: "1px dashed #2563EB" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h4 style={{ margin: 0, color: "#2563EB", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span><LuBrainCircuit /></span> AI Personality Insights
                  </h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                    Discover your Shopping DNA, unlock AI behavioral analysis and view badges.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/personality-insights")}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    marginTop: "0.5rem"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#be185d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#2563EB"}
                >
                  View Personality DNA
                </button>
              </div>

              {/* Achievements & Badges Banner Link */}
              <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", border: "1px dashed #2563EB" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h4 style={{ margin: 0, color: "#d97706", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span><LuTrophy /></span> Achievements & Badges
                  </h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                    View earned shopping badges, unlocked milestones, and trophy room updates.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/achievements")}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    marginTop: "0.5rem"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
                >
                  View Achievements
                </button>
              </div>

              {/* Smart Budget Manager Banner Link */}
              <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", border: "1px dashed #2563EB" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h4 style={{ margin: 0, color: "#2563EB", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span><LuSettings /></span> Smart Budget Manager
                  </h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                    Set weekly, monthly, and yearly budgets. Track spending and receive warnings.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/budget-manager")}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    marginTop: "0.5rem"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#be185d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#2563EB"}
                >
                  View Budget Manager
                </button>
              </div>



              {/* Shopping Intelligence Hub Banner Link */}
              <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", border: "1px dashed #2563EB" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h4 style={{ margin: 0, color: "#1e40af", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span><LuBrainCircuit /></span> Shopping Intelligence Hub
                  </h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                    Unified central command view of your DNA profiles, budget limits, stats, and achievements.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/shopping-intelligence")}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    marginTop: "0.5rem"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
                >
                  View Intelligence Hub
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Total Spent</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>
                    ₹{data ? Number(data.totalSpent).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}><LuWallet /></span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>This Month Spending</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>
                    ₹{data ? Number(data.thisMonthSpent).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}>📅</span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Average Order Value</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>
                    ₹{data ? Number(data.averageOrderValue).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}>💵</span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Largest Purchase</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>
                    ₹{data ? Number(data.largestPurchase).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}><LuTrophy /></span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Total Orders</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "bold" }}>
                    {data ? data.totalOrders : "0"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}><LuShoppingCart /></span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Favorite Category</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.5rem", margin: "0.5rem 0 0 0", fontWeight: "bold", textTransform: "capitalize" }}>
                    {data && data.favoriteCategory ? data.favoriteCategory : "—"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}><LuShoppingBag /></span>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>Favorite Brand</p>
                  <h3 style={{ color: "#2563EB", fontSize: "1.5rem", margin: "0.5rem 0 0 0", fontWeight: "bold", textTransform: "capitalize" }}>
                    {data && data.favoriteBrand ? data.favoriteBrand : "—"}
                  </h3>
                </div>
                <span style={{ fontSize: "2.2rem" }}><LuTag /></span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "#333", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem" }}>
                  <span><LuTrendingUp /></span> Monthly Spending Trend
                </h2>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#666" }} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spending"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} dot={{ fill: "#2563EB", r: 5 }} name="Spent Amount" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No monthly data available</div>
                )}
              </div>

              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "#333", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem" }}>
                  <span><LuChartLine /></span> Brand Spending
                </h2>
                {brandData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={brandData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#666" }} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                      <Legend />
                      <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} name="Brand Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No brand data available</div>
                )}
              </div>

              <div className="glass-card" style={{ padding: "1.5rem", gridColumn: "span 1" }}>
                <h2 style={{ color: "#333", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem" }}>
                  <span>🧩</span> Category Spending
                </h2>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={["#2563EB", "#f472b6", "#2563EB", "#be185d", "#9d174d", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"][index % 9]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No category data available</div>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h2 style={{ color: "#2563EB", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.3rem", fontWeight: "bold" }}>
                <span>📋</span> Purchase Analytics Summary
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #DBEAFE" }}>
                      <th style={{ padding: "0.75rem", color: "#555" }}>Metric</th>
                      <th style={{ padding: "0.75rem", color: "#555", textAlign: "right" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #DBEAFE" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>Favorite Category</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "bold", color: "#2563EB", textTransform: "capitalize" }}>{data ? data.favoriteCategory : "N/A"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #DBEAFE" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>Favorite Brand</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "bold", color: "#2563EB", textTransform: "capitalize" }}>{data ? data.favoriteBrand : "N/A"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #DBEAFE" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>Largest Purchase</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "bold", color: "#2563EB" }}>₹{data ? Number(data.largestPurchase).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #DBEAFE" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>Total Orders</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "bold", color: "#2563EB" }}>{data ? data.totalOrders : "0"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingInsightsPage({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/analytics/shopping-insights/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shopping insights");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "3rem", textAlign: "center", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ color: "#2563EB", margin: "1.5rem 0 1rem 0" }}>Access Denied</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Please log in to view your Smart Shopping Insights.</p>
          <button onClick={() => navigate("/login")} className="confirm-button" style={{ backgroundColor: "#2563EB", width: "100%" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const formatMonth = (monthStr) => {
    if (!monthStr || monthStr === "N/A") return "N/A";
    try {
      const parts = monthStr.split("-");
      if (parts.length === 2) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${monthNames[monthIndex]} ${year}`;
        }
      }
    } catch (e) { }
    return monthStr;
  };


  const readableMonth = data ? formatMonth(data.highestSpendingMonth) : "—";

  // Upgraded behavioral metrics with fallbacks
  const mostPurchasedProduct = data?.mostPurchasedProduct || "—";
  const largestPurchase = data?.largestPurchase !== undefined && data?.largestPurchase !== null ? Number(data.largestPurchase).toLocaleString("en-IN") : "0";
  const averageOrderValue = data?.averageOrderValue !== undefined && data?.averageOrderValue !== null ? Number(data.averageOrderValue).toLocaleString("en-IN", { maximumFractionDigits: 1 }) : "0";
  const totalSavings = data?.totalSavings !== undefined && data?.totalSavings !== null ? Number(data.totalSavings).toLocaleString("en-IN") : "0";
  const shoppingFrequency = data?.shoppingFrequencyDays !== undefined && data?.shoppingFrequencyDays !== null ? `${data.shoppingFrequencyDays} Days` : "—";
  const categoryDiversity = data?.categoryDiversity !== undefined && data?.categoryDiversity !== null ? `${data.categoryDiversity} Categories` : "—";
  const loyaltyPercentageVal = data?.loyaltyPercentage !== undefined && data?.loyaltyPercentage !== null ? `${data.loyaltyPercentage}%` : "—";

  // Format spending growth trend
  const spendingGrowth = data?.spendingGrowth;
  const hasGrowth = spendingGrowth !== undefined && spendingGrowth !== null;
  const growthText = hasGrowth ? `${spendingGrowth >= 0 ? "+" : ""}${spendingGrowth}%` : "—";

  // Build the array of dynamic AI recommendations messages
  const aiMessages = [];
  if (data) {
    if (data.mostPurchasedProduct) {
      aiMessages.push({
        text: `You purchased ${data.mostPurchasedProduct} more than any other product.`,
        icon: <LuTrophy />
      });
    }
    if (data.totalSavings !== undefined && data.totalSavings !== null && Number(data.totalSavings) > 0) {
      aiMessages.push({
        text: `You saved ₹${data.totalSavings} through discounts.`,
        icon: "💸"
      });
    }
    if (data.shoppingFrequencyDays) {
      aiMessages.push({
        text: `You typically shop every ${data.shoppingFrequencyDays} days.`,
        icon: <LuTimer />
      });
    }
    if (data.loyaltyPercentage && data.favoriteBrand) {
      aiMessages.push({
        text: `${data.loyaltyPercentage}% of your spending goes to ${data.favoriteBrand}.`,
        icon: "🤝"
      });
    }
    if (hasGrowth) {
      if (spendingGrowth > 0) {
        aiMessages.push({
          text: `Your spending increased by ${spendingGrowth}% compared to last month.`,
          icon: <LuTrendingUp />
        });
      } else if (spendingGrowth < 0) {
        aiMessages.push({
          text: `Your spending decreased by ${Math.abs(spendingGrowth)}% compared to last month.`,
          icon: <LuTrendingDown />
        });
      } else {
        aiMessages.push({
          text: "Your spending remained perfectly stable compared to last month.",
          icon: <LuScale />
        });
      }
    }
  }

  return (
    <div className="glass-dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "white", borderBottom: "2px solid #DBEAFE" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link>
          <h1 style={{ color: "#2563EB", margin: 0, fontSize: "1.8rem", fontWeight: "bold", marginLeft: "0.5rem" }}>Smart Shopping Insights</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineHome />
          </Link>
          <Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div>
          </Link>
          <Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div>
          </Link>
          <Link to="/expense-tracker" className="home-icon" title="Expense Tracker" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineInsights />
          </Link>
          <Link to="/profile" className="home-icon" title="Profile" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlinePerson />
          </Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          <button
            onClick={handleLogout}
            className="logout-button"
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#dc3545", color: "white" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem", color: "#2563EB", fontWeight: "bold" }}>
            Generating shopping insights...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "1rem", border: "2px solid #fca5a5" }}>
            <h3>Error loading insights</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* SECTION 1: Hero Summary Card */}
            <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", borderRadius: "1.5rem", padding: "3rem", color: "white", boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)", display: "flex", flexDirection: "column", gap: "1rem", position: "relative", overflow: "hidden" }}>
              <h2 style={{ fontSize: "2.5rem", margin: 0, fontWeight: "900", zIndex: 1 }}>Your Shopping Story</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", zIndex: 1, marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.15rem" }}>
                  <span style={{ fontSize: "1.5rem", background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "50%", display: "flex" }}><LuShoppingBag /></span>
                  {data?.favoriteCategory ? `Your shopping style is focused on ${data.favoriteCategory.charAt(0).toUpperCase() + data.favoriteCategory.slice(1)}.` : "You have a diverse shopping style."}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.15rem" }}>
                  <span style={{ fontSize: "1.5rem", background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "50%", display: "flex" }}><LuTag /></span>
                  {data?.totalSavings > 0 ? `You have saved ₹${totalSavings} through discounts.` : `You're building your shopping profile.`}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.15rem" }}>
                  <span style={{ fontSize: "1.5rem", background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "50%", display: "flex" }}><LuTimer /></span>
                  {data?.shoppingFrequencyDays ? `You shop approximately every ${data.shoppingFrequencyDays} days.` : `We're tracking your shopping frequency.`}
                </div>
              </div>
              <LuBrainCircuit style={{ position: "absolute", right: "-20px", top: "-20px", fontSize: "15rem", opacity: 0.1, transform: "rotate(15deg)" }} />
            </div>

            {/* SECTION 2: Shopping Highlights */}
            <div>
              <h3 style={{ fontSize: "1.6rem", color: "#1e3a8a", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}><LuTrophy /> Shopping Highlights</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Favorite Brand</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.5rem", textTransform: "capitalize" }}>{data?.favoriteBrand || "—"}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuTag /></div>
                </div>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Favorite Category</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.5rem", textTransform: "capitalize" }}>{data?.favoriteCategory || "—"}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuShoppingBag /></div>
                </div>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Most Purchased</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.25rem", textTransform: "capitalize" }}>{mostPurchasedProduct}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuTrophy /></div>
                </div>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Shopping Frequency</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.5rem", textTransform: "capitalize" }}>{shoppingFrequency}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuTimer /></div>
                </div>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Orders</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.5rem" }}>{data?.totalOrders || "0"}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuShoppingCart /></div>
                </div>

                <div className="glass-card" style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", transition: "transform 0.2s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Highest Spending Month</p>
                    <h4 style={{ margin: "0.5rem 0 0 0", color: "#0f172a", fontSize: "1.5rem" }}>{readableMonth}</h4>
                  </div>
                  <div style={{ padding: "0.75rem", background: "#eff6ff", color: "#3b82f6", borderRadius: "0.75rem", fontSize: "1.5rem", display: "flex" }}><LuTrendingUp /></div>
                </div>

              </div>
            </div>

            {/* SECTION 3: Did You Know? */}
            <div>
              <h3 style={{ fontSize: "1.6rem", color: "#1e3a8a", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}><LuBrainCircuit /> Did You Know?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                {data?.totalSavings > 0 && (
                  <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "1rem", borderLeft: "4px solid #3b82f6", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <p style={{ margin: 0, color: "#334155", fontSize: "1.05rem", lineHeight: "1.5" }}>You save more than the average shopper!</p>
                  </div>
                )}
                {data?.favoriteCategory && (
                  <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "1rem", borderLeft: "4px solid #8b5cf6", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <p style={{ margin: 0, color: "#334155", fontSize: "1.05rem", lineHeight: "1.5" }}>{data.favoriteCategory.charAt(0).toUpperCase() + data.favoriteCategory.slice(1)} accounts for most of your purchases.</p>
                  </div>
                )}
                {largestPurchase !== "0" && (
                  <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "1rem", borderLeft: "4px solid #10b981", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <p style={{ margin: 0, color: "#334155", fontSize: "1.05rem", lineHeight: "1.5" }}>Your largest purchase was ₹{largestPurchase}.</p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: Savings Spotlight */}
            <div style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderRadius: "1.5rem", padding: "2.5rem", border: "1px solid #a7f3d0", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.1)" }}>
              <h3 style={{ fontSize: "1.6rem", color: "#064e3b", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}><LuWallet /> Savings Spotlight</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ color: "#059669", margin: 0, fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Savings</p>
                  <h4 style={{ color: "#064e3b", fontSize: "2.2rem", margin: "0.5rem 0 0 0", fontWeight: "900" }}>₹{totalSavings}</h4>
                </div>
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ color: "#059669", margin: 0, fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Discount Usage</p>
                  <h4 style={{ color: "#064e3b", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "800" }}>{data?.totalSavings > 0 ? "Excellent" : "Developing"}</h4>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>Keep using coupons to maximize your value.</p>
                </div>
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ color: "#059669", margin: 0, fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Potential Future Savings</p>
                  <h4 style={{ color: "#064e3b", fontSize: "1.8rem", margin: "0.5rem 0 0 0", fontWeight: "800" }}>High</h4>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>Watch out for upcoming sales events!</p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Shopping Habits Breakdown */}
            <div>
              <h3 style={{ fontSize: "1.6rem", color: "#1e3a8a", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}><LuChartLine /> Shopping Habits Breakdown</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "flex-end" }}>
                    <strong style={{ color: "#475569", fontSize: "1.05rem" }}>Brand Loyalty</strong>
                    <span style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1.2rem" }}>{loyaltyPercentageVal}</span>
                  </div>
                  <div style={{ width: "100%", background: "#f1f5f9", borderRadius: "1rem", height: "10px", overflow: "hidden" }}>
                    <div style={{ width: loyaltyPercentageVal === "—" ? "0%" : loyaltyPercentageVal, background: "linear-gradient(90deg, #60a5fa, #2563eb)", height: "100%", borderRadius: "1rem", transition: "width 1s ease-in-out" }}></div>
                  </div>
                  <p style={{ margin: "0.75rem 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>Percentage of purchases from your favorite brand.</p>
                </div>

                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "flex-end" }}>
                    <strong style={{ color: "#475569", fontSize: "1.05rem" }}>Spending Growth</strong>
                    <span style={{ color: hasGrowth ? (spendingGrowth >= 0 ? "#10b981" : "#ef4444") : "#3b82f6", fontWeight: "bold", fontSize: "1.2rem" }}>{growthText}</span>
                  </div>
                  <div style={{ width: "100%", background: "#f1f5f9", borderRadius: "1rem", height: "10px", overflow: "hidden" }}>
                    <div style={{ width: hasGrowth ? `${Math.min(Math.abs(spendingGrowth), 100)}%` : "0%", background: hasGrowth ? (spendingGrowth >= 0 ? "#10b981" : "#ef4444") : "#cbd5e1", height: "100%", borderRadius: "1rem", transition: "width 1s ease-in-out" }}></div>
                  </div>
                  <p style={{ margin: "0.75rem 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>Compared to your previous month.</p>
                </div>

                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "flex-end" }}>
                    <strong style={{ color: "#475569", fontSize: "1.05rem" }}>Average Order Value</strong>
                    <span style={{ color: "#8b5cf6", fontWeight: "bold", fontSize: "1.2rem" }}>₹{averageOrderValue}</span>
                  </div>
                  <div style={{ width: "100%", background: "#f1f5f9", borderRadius: "1rem", height: "10px", overflow: "hidden" }}>
                    <div style={{ width: averageOrderValue !== "0" ? "65%" : "0%", background: "linear-gradient(90deg, #a78bfa, #7c3aed)", height: "100%", borderRadius: "1rem", transition: "width 1s ease-in-out" }}></div>
                  </div>
                  <p style={{ margin: "0.75rem 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>Average amount spent per checkout.</p>
                </div>

                <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "flex-end" }}>
                    <strong style={{ color: "#475569", fontSize: "1.05rem" }}>Category Diversity</strong>
                    <span style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1.2rem" }}>{categoryDiversity}</span>
                  </div>
                  <div style={{ width: "100%", background: "#f1f5f9", borderRadius: "1rem", height: "10px", overflow: "hidden" }}>
                    <div style={{ width: data?.categoryDiversity ? `${Math.min(data.categoryDiversity * 10, 100)}%` : "0%", background: "linear-gradient(90deg, #fbbf24, #d97706)", height: "100%", borderRadius: "1rem", transition: "width 1s ease-in-out" }}></div>
                  </div>
                  <p style={{ margin: "0.75rem 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>Number of unique product categories explored.</p>
                </div>

              </div>
            </div>

            {/* SECTION 6: Fun Facts */}
            <div style={{ background: "white", borderRadius: "1.5rem", padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.6rem", color: "#1e3a8a", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}><span>✨</span> Fun Facts</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {readableMonth !== "—" && (
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem", color: "#334155" }}>
                    <span style={{ color: "#f59e0b", fontSize: "1.2rem", display: "flex" }}><LuTrophy /></span> Your most active shopping month was <strong style={{ color: "#2563EB" }}>{readableMonth}</strong>.
                  </li>
                )}
                {data?.favoriteCategory && (
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem", color: "#334155" }}>
                    <span style={{ color: "#f59e0b", fontSize: "1.2rem", display: "flex" }}><LuTrophy /></span> <strong style={{ color: "#2563EB", textTransform: "capitalize" }}>{data.favoriteCategory}</strong> is your dominant category.
                  </li>
                )}
                {data?.categoryDiversity !== undefined && data?.categoryDiversity !== null && (
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem", color: "#334155" }}>
                    <span style={{ color: "#f59e0b", fontSize: "1.2rem", display: "flex" }}><LuTrophy /></span> You have explored <strong style={{ color: "#2563EB" }}>{data.categoryDiversity}</strong> categor{data.categoryDiversity === 1 ? "y" : "ies"} so far.
                  </li>
                )}
              </ul>
            </div>

          </div >
        )}
      </div >
    </div >
  );
}

function PersonalityInsightsPage({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [evolutionData, setEvolutionData] = useState(null);
  const [dnaScoreData, setDnaScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealStage, setRevealStage] = useState(0);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const fetchPersonality = fetch(`http://localhost:8080/analytics/personality/${user.id}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch personality")));
    const fetchEvolution = fetch(`http://localhost:8080/analytics/personality-evolution/${user.id}`)
      .then(res => res.ok ? res.json() : null).catch(() => null);
    const fetchDnaScore = fetch(`http://localhost:8080/analytics/dna-score/${user.id}`)
      .then(res => res.ok ? res.json() : null).catch(() => null);

    Promise.all([fetchPersonality, fetchEvolution, fetchDnaScore])
      .then(([resData, evoData, scoreData]) => {
        setData(resData);
        setEvolutionData(evoData);
        setDnaScoreData(scoreData);
        setLoading(false);
        setRevealStage(1);
        setTimeout(() => setRevealStage(2), 1000);
        setTimeout(() => setRevealStage(3), 2000);
        setTimeout(() => setRevealStage(4), 3000);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "3rem", textAlign: "center", maxWidth: "450px" }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ color: "white", margin: "1.5rem 0 1rem 0" }}>Access Denied</h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>Please log in to view your Gamified Insights.</p>
          <button onClick={() => navigate("/login")} style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.75rem", borderRadius: "8px", width: "100%", fontWeight: "bold", cursor: "pointer" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getGamifiedStory = (primary) => {
    if (!primary) return "You are exploring your shopping identity. Make more purchases to unlock your story!";
    const p = primary.toLowerCase();
    if (p.includes("tech")) return "You are primarily a Tech Enthusiast! You love staying on the cutting edge, grabbing the latest gadgets and exploring innovation. Your consistent high-tech choices show strong brand loyalty and a hunger for knowledge.";
    if (p.includes("fashion") || p.includes("apparel")) return "You are primarily a Fashion Explorer! You enjoy discovering clothing trends and frequently explore stylish products. Your confidence score indicates strong consistency in your trendy shopping behavior.";
    if (p.includes("book") || p.includes("knowledge")) return "You are primarily a Knowledge Seeker! Books and educational items are your domain. You're building a massive library and investing in your mind.";
    if (p.includes("budget") || p.includes("saving") || p.includes("conscious")) return "You are primarily a Deal Master! You wait for the right moment, stack discounts, and maximize value. Your strategic shopping behavior sets you apart.";
    if (p.includes("premium") || p.includes("luxury")) return "You are primarily a Luxury Connoisseur! Quality over quantity is your motto. You gravitate towards premium items that offer unparalleled experiences.";
    return `You are primarily a ${primary}! Your shopping behavior is distinct and consistent, reflecting your unique personal tastes.`;
  };

  const getProgressData = (grade, score) => {
    const safeGrade = grade || 'D';
    if (safeGrade === 'D') return { current: 'D', next: 'C', required: 50, diff: Math.max(0, 50 - score), reward: "5% OFF" };
    if (safeGrade === 'C') return { current: 'C', next: 'B', required: 75, diff: Math.max(0, 75 - score), reward: "10% OFF" };
    if (safeGrade === 'B') return { current: 'B', next: 'A', required: 90, diff: Math.max(0, 90 - score), reward: "15% OFF" };
    if (safeGrade === 'A') return { current: 'A', next: 'S', required: 100, diff: Math.max(0, 100 - score), reward: "20% OFF" };
    return { current: 'S', next: 'MAX', required: 100, diff: 0, reward: "Ultimate VIP Status" };
  };

  const getUnlockedRewardsList = (grade) => {
    const list = [];
    const safeGrade = grade || 'D';
    if (['S', 'A', 'B', 'C', 'D'].includes(safeGrade)) list.push({ name: "Grade D Milestone", code: "REWARD-D", discount: "2%", status: "Available", expire: "End of Month" });
    if (['S', 'A', 'B', 'C'].includes(safeGrade)) list.push({ name: "Grade C Milestone", code: "REWARD-C", discount: "5%", status: "Available", expire: "End of Month" });
    if (['S', 'A', 'B'].includes(safeGrade)) list.push({ name: "Grade B Milestone", code: "REWARD-B", discount: "10%", status: "Available", expire: "End of Month" });
    if (['S', 'A'].includes(safeGrade)) list.push({ name: "Grade A Milestone", code: "REWARD-A", discount: "15%", status: "Available", expire: "End of Month" });
    if (['S'].includes(safeGrade)) list.push({ name: "Ultimate Grade S", code: "REWARD-S", discount: "20%", status: "Available", expire: "End of Year" });
    return list.reverse();
  };

  const score = dnaScoreData?.score || 0;
  const backendGrade = dnaScoreData?.grade || "D";
  const progressData = getProgressData(backendGrade, score);
  const rewards = getUnlockedRewardsList(backendGrade);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", fontFamily: "Segoe UI, sans-serif", color: "white" }}>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.95); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "1.8rem", color: "white" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "white" }} />
          </Link>
          <h1 style={{ color: "white", margin: 0, fontSize: "1.5rem", fontWeight: "bold", marginLeft: "0.5rem" }}>Shopping Wrapped</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center", color: "white" }}><MdOutlineHome /></Link>
          <Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center", color: "white" }}>
            <div className="nav-icon-container"><LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}</div>
          </Link>
          <Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center", color: "white" }}>
            <div className="nav-icon-container"><LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length}</span>}</div>
          </Link>
          <button onClick={handleLogout} className="logout-button" style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "none", borderRadius: "4px", backgroundColor: "#ef4444", color: "white", marginLeft: "1rem" }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: "2.5rem", maxWidth: "1000px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem", color: "#60a5fa", fontWeight: "bold" }}>
            Generating Your Shopping Wrapped...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#fca5a5", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "1rem", border: "1px solid rgba(239,68,68,0.3)" }}>
            <h3>Error loading insights</h3>
            <p>{error}</p>
          </div>
        ) : revealStage < 4 ? (
          <div style={{ textAlign: "center", padding: "8rem 2rem", backgroundColor: "rgba(30, 41, 59, 0.7)", borderRadius: "1.5rem", border: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)", position: "relative", overflow: "hidden", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}></div>

            <div style={{ position: "relative", zIndex: 10 }}>
              {revealStage === 1 && (
                <div style={{ animation: "fadeInOut 1s ease-in-out forwards" }}>
                  <LuSearch style={{ fontSize: "4rem", color: "#60a5fa", marginBottom: "1rem" }} />
                  <h2 style={{ fontSize: "2rem", color: "#60a5fa", letterSpacing: "2px", fontWeight: "300" }}>Analyzing Shopping Behavior...</h2>
                </div>
              )}
              {revealStage === 2 && (
                <div style={{ animation: "fadeInOut 1s ease-in-out forwards" }}>
                  <LuBrainCircuit style={{ fontSize: "4rem", color: "#8b5cf6", marginBottom: "1rem" }} />
                  <h2 style={{ fontSize: "2rem", color: "#8b5cf6", letterSpacing: "2px", fontWeight: "300" }}>Identifying Dominant Traits...</h2>
                </div>
              )}
              {revealStage === 3 && (
                <div style={{ animation: "fadeIn 1s ease-in-out forwards" }}>
                  <LuStar style={{ fontSize: "5rem", color: "#10b981", marginBottom: "1rem", filter: "drop-shadow(0 0 10px rgba(16,185,129,0.8))" }} />
                  <h2 style={{ fontSize: "2.5rem", color: "#10b981", letterSpacing: "2px", textShadow: "0 0 15px rgba(16, 185, 129, 0.6)", fontWeight: "bold" }}>Personality Identified</h2>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", animation: "fadeInUp 0.8s ease-out forwards" }}>

            {/* SECTION 1: HERO CARD */}
            <div style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              borderRadius: "1.5rem",
              padding: "3.5rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)"
            }}>
              <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "150%", height: "200%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }}></div>
              <h2 style={{ fontSize: "3rem", margin: "0 0 0.5rem 0", fontWeight: "900", letterSpacing: "-1px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                {data?.primaryPersonality || "Mystery Shopper"}
              </h2>
              <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
                <div style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", minWidth: "140px" }}>
                  <div style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "1px" }}>DNA Score</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0" }}>{score}</div>
                </div>
                <div style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", minWidth: "140px" }}>
                  <div style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "1px" }}>Grade</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0", color: "#fbbf24" }}>{dnaScoreData?.grade || "D"}</div>
                </div>
                <div style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", minWidth: "140px" }}>
                  <div style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "1px" }}>Confidence</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0" }}>{data?.confidence || "N/A"}</div>
                </div>
              </div>

              {data?.secondaryPersonalities && data.secondaryPersonalities.length > 0 && (
                <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
                  <div style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "2px", marginBottom: "1.5rem" }}>Additional Traits</div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {data.secondaryPersonalities.map((sec, idx) => (
                      <div key={idx} style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", padding: "0.75rem 1.25rem", borderRadius: "2rem", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <LuStar style={{ color: "#fbbf24", fontSize: "1.2rem" }} />
                        <span style={{ fontSize: "1rem", fontWeight: "600", letterSpacing: "0.5px" }}>{sec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* SECTION 2 & 3: STORY & GRADE REWARD */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
              {/* SECTION 2: SHOPPING STORY */}
              <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem" }}>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem", color: "#60a5fa" }}>
                  <LuBrainCircuit /> Your Story
                </h3>
                <p style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#e2e8f0" }}>
                  {getGamifiedStory(data?.primaryPersonality)}
                </p>
              </div>

              {/* SECTION 3: GRADE REWARD SYSTEM */}
              <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: "-10%", top: "-10%", fontSize: "10rem", opacity: 0.05, transform: "rotate(15deg)" }}>🏆</div>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem", color: "#fbbf24" }}>
                  <LuTrophy /> Grade Goal
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", backgroundColor: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "1rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase" }}>Current</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>{progressData.current}</div>
                  </div>
                  <LuArrowRight style={{ fontSize: "2rem", color: "#64748b" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase" }}>Next Goal</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#fbbf24" }}>{progressData.next}</div>
                  </div>
                </div>
                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: "1.5rem" }}>
                  <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Reward for reaching {progressData.next}:</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <LuTag /> {progressData.reward} Coupon
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: PROGRESS BAR */}
            <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.5rem", margin: 0, color: "white" }}>Level Progress</h3>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#60a5fa" }}>{score} / {progressData.required} XP</span>
              </div>
              <div style={{ width: "100%", height: "24px", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, (score / progressData.required) * 100)}%`,
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  borderRadius: "12px",
                  transition: "width 1s ease-in-out"
                }}></div>
              </div>
              {progressData.diff > 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", margin: 0, fontSize: "1.1rem" }}>
                  Only <strong style={{ color: "white" }}>{progressData.diff}</strong> more DNA points needed to unlock your next reward.
                </p>
              ) : (
                <p style={{ textAlign: "center", color: "#10b981", margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
                  You have reached the maximum grade! Excellent shopping!
                </p>
              )}
            </div>

            {/* SECTION 5: UNLOCKED REWARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
                <LuPackage /> Unlocked Rewards
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {rewards.map((rew, idx) => (
                  <div key={idx} style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    position: "relative"
                  }}>
                    <div style={{ position: "absolute", right: "1rem", top: "1rem", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                      {rew.status}
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{rew.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "900", color: "#a78bfa" }}>{rew.discount}</div>
                      <div style={{ fontSize: "1rem", color: "#94a3b8", lineHeight: "1" }}>OFF</div>
                    </div>
                    <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "0.5rem", textAlign: "center", letterSpacing: "2px", fontFamily: "monospace", fontSize: "1.1rem", border: "1px dashed rgba(255,255,255,0.2)" }}>
                      {rew.code}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", textAlign: "center" }}>Valid until {rew.expire}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6 & 7: MOTIVATION & EVOLUTION */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
              {/* SECTION 6: MOTIVATION */}
              <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem" }}>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem", color: "#34d399" }}>
                  <LuTrendingUp /> Guidance
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start", fontSize: "1.05rem" }}>
                    <span style={{ color: "#34d399", fontSize: "1.2rem" }}>✓</span>
                    <span>Reduce cancellations to maintain a high DNA Score.</span>
                  </li>
                  <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start", fontSize: "1.05rem" }}>
                    <span style={{ color: "#34d399", fontSize: "1.2rem" }}>✓</span>
                    <span>Explore more categories to diversify your style.</span>
                  </li>
                  <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start", fontSize: "1.05rem" }}>
                    <span style={{ color: "#34d399", fontSize: "1.2rem" }}>✓</span>
                    <span>Use unlocked discounts during checkout!</span>
                  </li>
                </ul>
              </div>

              {/* SECTION 7: EVOLUTION */}
              <div style={{ backgroundColor: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem" }}>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem", color: "#c084fc" }}>
                  <LuTimer /> Personality Evolution
                </h3>
                {evolutionData ? (
                  <div style={{ position: "relative", paddingLeft: "2rem", borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ position: "relative", marginBottom: "2rem" }}>
                      <div style={{ position: "absolute", left: "-2.45rem", top: "0.25rem", width: "1rem", height: "1rem", backgroundColor: "#64748b", borderRadius: "50%" }}></div>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Previous</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{evolutionData.previousPersonality || "Unknown"}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-2.45rem", top: "0.25rem", width: "1rem", height: "1rem", backgroundColor: "#a78bfa", borderRadius: "50%", boxShadow: "0 0 10px #a78bfa" }}></div>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Current</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#a78bfa" }}>{evolutionData.currentPersonality || data?.primaryPersonality || "Unknown"}</div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8" }}>Keep shopping to track your evolution over time!</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}



function ShoppingIntelligenceDashboard({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/analytics/intelligence-dashboard/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch intelligence dashboard data");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "3rem", textAlign: "center", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ color: "#2563EB", margin: "1.5rem 0 1rem 0" }}>Access Denied</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Please log in to view the Shopping Intelligence Hub.</p>
          <button onClick={() => navigate("/login")} className="confirm-button" style={{ backgroundColor: "#2563EB", width: "100%" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const categoryData = data?.expenseTracker?.categorySpending ?
    Object.entries(data.expenseTracker.categorySpending).map(([category, amount]) => ({ name: category, value: Math.round(amount) })) : [];

  const monthlyData = data?.expenseTracker?.monthlyTrend ?
    Object.entries(data.expenseTracker.monthlyTrend).map(([month, amount]) => ({ name: month, amount: Math.round(amount) })) : [];

  const hasExpenseData = data?.expenseTracker?.totalSpent > 0 || categoryData.length > 0 || monthlyData.length > 0;

  // Fallback calculations for DNA / Personality
  const dnaScore = data?.dnaScore?.score !== undefined ? data.dnaScore.score : 0;
  const grade = data?.dnaScore?.grade || "D";
  const primaryPersonality = data?.personality?.primaryPersonality || "Mystery Shopper";
  const confidence = data?.personality?.confidence !== undefined ? `${data.personality.confidence}%` : "—";
  const personalityStrength = data?.personality?.personalityStrength || "—";

  // Achievements
  const totalBadges = data?.achievements?.totalBadges !== undefined ? data.achievements.totalBadges : 0;
  const badges = data?.achievements?.badges || [];

  // Budget
  const hasBudget = data?.budget && !data.budget.message; // message is e.g. "No budget set"
  const budgetAmount = data?.budget?.budgetAmount || 0;
  const spent = data?.budget?.spent || 0;
  const remaining = data?.budget?.remaining || 0;
  const percentUsed = data?.budget?.percentUsed !== undefined ? data.budget.percentUsed : 0;
  const alertLevel = data?.budget?.alertLevel || "Safe";

  // Quick stats
  const totalSpentStr = data?.expenseTracker?.totalSpent !== undefined ? Number(data.expenseTracker.totalSpent).toLocaleString("en-IN") : "0";
  const totalOrdersVal = data?.expenseTracker?.totalOrders !== undefined ? data.expenseTracker.totalOrders : 0;
  const avgOrderValStr = data?.shoppingInsights?.averageOrderValue !== undefined ? Number(data.shoppingInsights.averageOrderValue).toLocaleString("en-IN", { maximumFractionDigits: 1 }) : "0";
  const totalSavingsStr = data?.shoppingInsights?.totalSavings !== undefined ? Number(data.shoppingInsights.totalSavings).toLocaleString("en-IN") : "0";

  // Reusable card component
  const DashboardCard = ({ title, icon, children }) => (
    <div className="intel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ margin: 0, color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: "bold" }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span> {title}
      </h3>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="glass-dashboard-container">
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "white", borderBottom: "2px solid #DBEAFE" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link>
          <h1 style={{ color: "#2563EB", margin: 0, fontSize: "1.8rem", fontWeight: "bold", marginLeft: "0.5rem" }}>Shopping Intelligence Hub</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center" }}><MdOutlineHome /></Link>
          <Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div>
          </Link>
          <Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div>
          </Link>
          <Link to="/expense-tracker" className="home-icon" title="Expense Tracker" style={{ display: "inline-flex", alignItems: "center" }}><MdOutlineInsights /></Link>
          <Link to="/profile" className="home-icon" title="Profile" style={{ display: "inline-flex", alignItems: "center" }}><MdOutlinePerson /></Link>
          <Link to="/achievements" className="home-icon" title="Achievements" style={{ display: "inline-flex", alignItems: "center" }}><MdOutlineEmojiEvents /></Link>
          <Link to="/budget-manager" className="home-icon" title="Budget Manager" style={{ display: "inline-flex", alignItems: "center" }}><MdOutlineAccountBalanceWallet /></Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          <button onClick={handleLogout} className="logout-button" style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#dc3545", color: "white", marginLeft: "1rem" }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", color: "#64748B", margin: "0 0 0.5rem 0", fontWeight: "500" }}>
            Unified central command view of your DNA profiles, budget limits, stats, and achievements
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem", color: "#2563EB", fontWeight: "bold" }}>
            Loading analytics...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "1rem", border: "2px solid #fca5a5" }}>
            <h3>Error loading intelligence hub</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Top Grid: DNA Profile, Budget, Achievements, Quick Stats */}
            <div className="intel-dashboard-grid">

              {/* DNA Score & Personality Card */}
              <DashboardCard title="Shopping DNA Profile" icon="🧬">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center", height: "100%" }}>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)", padding: "1rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: "bold", letterSpacing: "1px" }}>DNA Score</div>
                      <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#2563EB" }}>{dnaScore}</div>
                    </div>
                    <div style={{ width: "2px", alignSelf: "stretch", backgroundColor: "rgba(37, 99, 235, 0.2)" }}></div>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: "bold", letterSpacing: "1px" }}>Grade Milestone</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#f59e0b" }}>Grade {grade}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>Primary Personality</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", textTransform: "capitalize" }}>{primaryPersonality}</div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    <div>
                      <span style={{ color: "#64748b" }}>Confidence: </span>
                      <span style={{ fontWeight: "bold", color: "#2563EB" }}>{confidence}</span>
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Strength: </span>
                      <span style={{ fontWeight: "bold", color: "#2563EB" }}>{personalityStrength}</span>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Budget Overview Card */}
              <DashboardCard title="Smart Budget Overview" icon="👛">
                {hasBudget ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "bold" }}>CYCLE LIMIT</div>
                        <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a" }}>₹{budgetAmount.toLocaleString("en-IN")}</div>
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: "bold", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.5rem", borderRadius: "0.5rem" }}>
                        {data?.budget?.budgetType} Cycle
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "4px 0" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Spent</div>
                        <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#ef4444" }}>₹{spent.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Remaining</div>
                        <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#10b981" }}>₹{remaining.toLocaleString("en-IN")}</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b" }}>
                        <span>Usage Progress</span>
                        <span style={{ fontWeight: "bold" }}>{percentUsed}%</span>
                      </div>
                      <div className="intel-progress-bar-bg">
                        <div
                          className="intel-progress-bar-fill"
                          style={{
                            width: `${Math.min(percentUsed, 100)}%`,
                            backgroundColor: alertLevel === "Safe" ? "#10b981" : alertLevel === "Warning" ? "#f59e0b" : "#ef4444"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.75rem", color: alertLevel === "Safe" ? "#059669" : alertLevel === "Warning" ? "#d97706" : "#dc2626", fontWeight: "bold", marginTop: "4px", textAlign: "right" }}>
                        Status: {alertLevel} Mode
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1rem", height: "100%", padding: "1rem 0" }}>
                    <span style={{ fontSize: "2rem" }}>👛</span>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>No budget configured.</p>
                    <button
                      onClick={() => navigate("/budget-manager")}
                      className="glass-btn-secondary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
                    >
                      Set Budget Limit
                    </button>
                  </div>
                )}
              </DashboardCard>

              {/* Achievements & Badges Card */}
              <DashboardCard title="Trophy Room Achievements" icon="🏆">
                {badges.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "bold" }}>
                      UNLOCKED {totalBadges} {totalBadges === 1 ? 'BADGE' : 'BADGES'}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flex: 1, contentVisibility: "auto" }}>
                      {badges.map((badge, idx) => {
                        let badgeEmoji = "⭐";
                        if (badge.includes("Purchase")) badgeEmoji = "🎁";
                        else if (badge.includes("Club")) badgeEmoji = "👑";
                        else if (badge.includes("Hunter")) badgeEmoji = "🎯";
                        else if (badge.includes("Master")) badgeEmoji = "💼";
                        else if (badge.includes("Elite")) badgeEmoji = "🛡️";

                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              backgroundColor: "rgba(245, 158, 11, 0.1)",
                              color: "#d97706",
                              padding: "0.35rem 0.7rem",
                              borderRadius: "2rem",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              border: "1px solid rgba(245, 158, 11, 0.25)"
                            }}
                            title={badge}
                          >
                            <span>{badgeEmoji}</span>
                            <span style={{ maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{badge}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => navigate("/achievements")}
                      className="glass-btn-secondary"
                      style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem", width: "100%", marginTop: "auto" }}
                    >
                      View Trophy Room
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1rem", height: "100%", padding: "1rem 0" }}>
                    <span style={{ fontSize: "2rem" }}>🏆</span>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>No achievements yet.</p>
                    <button
                      onClick={() => navigate("/achievements")}
                      className="glass-btn-secondary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
                    >
                      View Milestones
                    </button>
                  </div>
                )}
              </DashboardCard>

              {/* Quick Stats Card */}
              <DashboardCard title="Quick Stats" icon="📊">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", height: "100%" }}>
                  <div style={{ backgroundColor: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "bold" }}>TOTAL SPENT</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>₹{totalSpentStr}</div>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "bold" }}>TOTAL ORDERS</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>{totalOrdersVal}</div>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "bold" }}>AVG ORDER VALUE</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>₹{avgOrderValStr}</div>
                  </div>
                  <div style={{ backgroundColor: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "bold" }}>TOTAL SAVINGS</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#10b981" }}>₹{totalSavingsStr}</div>
                  </div>
                </div>
              </DashboardCard>

            </div>

            {/* Middle Section: Recharts Spending Trends Analytics (Double-width layout) */}
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ margin: "0 0 1.5rem 0", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.3rem", fontWeight: "bold" }}>
                <span>📈</span> Expense Analytics & Trends
              </h3>

              {hasExpenseData ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>

                  {/* Monthly Trend Chart */}
                  <div>
                    <h4 style={{ color: "#374151", fontSize: "1.05rem", fontWeight: "bold", marginBottom: "1rem" }}>Monthly Spending Trend</h4>
                    {monthlyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={265}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
                          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spending"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                          <Legend />
                          <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} dot={{ fill: "#2563EB", r: 5 }} name="Spent Amount" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: "265px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No monthly data available</div>
                    )}
                  </div>

                  {/* Category Spending Chart */}
                  <div>
                    <h4 style={{ color: "#374151", fontSize: "1.05rem", fontWeight: "bold", marginBottom: "1rem" }}>Category Distribution</h4>
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={265}>
                        <BarChart data={categoryData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
                          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid #DBEAFE" }} />
                          <Legend />
                          <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Spent per Category" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: "265px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No category spending available</div>
                    )}
                  </div>

                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                  <span style={{ fontSize: "3rem" }}>📊</span>
                  <p style={{ marginTop: "1rem", fontSize: "1.05rem" }}>Loading analytics...</p>
                </div>
              )}
            </div>

            {/* Bottom Row: AI Recommendations & Detailed Insights */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>

              {/* Recommendations Card */}
              <div className="glass-card" style={{ padding: "2rem" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.3rem", fontWeight: "bold" }}>
                  <span>💡</span> AI Recommendations & Guidance
                </h3>
                {data?.recommendations?.recommendations && data.recommendations.recommendations.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {data.recommendations.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "flex-start",
                          backgroundColor: "#F8FAFC",
                          padding: "1rem",
                          borderRadius: "0.75rem",
                          borderLeft: "4px solid #3b82f6",
                          border: "1px solid #E2E8F0",
                          borderLeftWidth: "4px"
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>🤖</span>
                        <span style={{ fontSize: "0.95rem", color: "#374151", lineHeight: "1.4", fontWeight: "500" }}>{rec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#64748b", padding: "1rem 0" }}>No custom recommendations at this time. Maintain healthy shopping habits!</div>
                )}
              </div>

              {/* Shopping Insights Table Summary */}
              <div className="glass-card" style={{ padding: "2rem" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.3rem", fontWeight: "bold" }}>
                  <span>🎯</span> Shopping Behavior Insights
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td style={{ padding: "0.75rem 0", color: "#64748b", fontWeight: "500" }}>Favorite Category</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "bold", color: "#2563EB", textTransform: "capitalize" }}>
                          {data?.shoppingInsights?.favoriteCategory !== "N/A" ? data?.shoppingInsights?.favoriteCategory : "None yet"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td style={{ padding: "0.75rem 0", color: "#64748b", fontWeight: "500" }}>Favorite Brand</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "bold", color: "#2563EB", textTransform: "capitalize" }}>
                          {data?.shoppingInsights?.favoriteBrand !== "N/A" ? data?.shoppingInsights?.favoriteBrand : "None yet"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td style={{ padding: "0.75rem 0", color: "#64748b", fontWeight: "500" }}>Shopping Frequency</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "bold", color: "#0f172a" }}>
                          {data?.shoppingInsights?.shoppingFrequencyDays > 0 ? `Every ${data.shoppingInsights.shoppingFrequencyDays} days` : "Not enough purchases"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td style={{ padding: "0.75rem 0", color: "#64748b", fontWeight: "500" }}>Category Diversity</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "bold", color: "#0f172a" }}>
                          {data?.shoppingInsights?.categoryDiversity > 0 ? `${data.shoppingInsights.categoryDiversity} Categories` : "None"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0.75rem 0", color: "#64748b", fontWeight: "500" }}>Most Purchased Product</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "bold", color: "#0f172a", textTransform: "capitalize" }}>
                          {data?.shoppingInsights?.mostPurchasedProduct !== "N/A" ? data?.shoppingInsights?.mostPurchasedProduct : "None yet"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}


function BudgetManagerPage({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [removing, setRemoving] = useState(false);

  // ===== Category Budget Feature State =====
  const [budgetMode, setBudgetMode] = useState("both"); // "overall" | "category" | "both"
  const [categoryBudgets, setCategoryBudgets] = useState({}); // { catName: { amount, budgetType } }
  const [categorySpending, setCategorySpending] = useState({});
  const [catBudgetCategory, setCatBudgetCategory] = useState("");
  const [catBudgetAmount, setCatBudgetAmount] = useState("");
  const [catBudgetType, setCatBudgetType] = useState("Monthly");
  const [catBudgetSuccess, setCatBudgetSuccess] = useState(false);
  const [showCatRemoveModal, setShowCatRemoveModal] = useState(null); // category name or null
  const [catBudgetFilter, setCatBudgetFilter] = useState("All"); // "All" | "Weekly" | "Monthly" | "Yearly"

  // Allowed budget categories (dropdown only — no free text)
  const budgetCategories = [
    { name: "Fashion" },
    { name: "Electronics" },
    { name: "Books" },
    { name: "Beauty" },
    { name: "Home & Kitchen" },
    { name: "Sports" },
    { name: "Accessories" },
  ];

  const getCategoryIcon = (catName) => {
    const found = budgetCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return found ? found.icon : "🏷️";
  };

  // Helper to get budget amount from the new { amount, budgetType } structure
  const getCatBudgetAmount = (catData) => {
    if (typeof catData === 'number') return catData; // backward compat for old format
    return catData?.amount || 0;
  };
  const getCatBudgetType = (catData) => {
    if (typeof catData === 'number') return "Monthly"; // backward compat
    return catData?.budgetType || "Monthly";
  };

  const fetchCategoryBudgets = useCallback(() => {
    if (!user || !user.id) return;
    fetch(`http://localhost:8080/analytics/category-budget/${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const budgetsObj = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            budgetsObj[item.category] = {
              amount: item.budgetAmount,
              budgetType: item.budgetType,
              spent: item.spent,
              remaining: item.remaining,
              percentUsed: item.percentUsed,
              status: item.status
            };
          });
        }
        setCategoryBudgets(budgetsObj);
      })
      .catch(err => {
        console.error("Error loading category budgets:", err);
      });
  }, [user]);

  useEffect(() => {
    fetchCategoryBudgets();
  }, [user, fetchCategoryBudgets]);

  // Fetch category spending from expense tracker API (preserved for other components/analytics dependency if any)
  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:8080/analytics/expense-tracker/${user.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.categorySpending) {
            setCategorySpending(data.categorySpending);
          }
        })
        .catch(err => console.error("Error fetching category spending:", err));
    }
  }, [user]);

  // Category budget status helper (preserved as helper fallback)
  const getCategoryStatus = (spent, budget) => {
    if (budget <= 0) return { status: "Safe", color: "#10b981", percent: 0 };
    const percent = Math.round((spent / budget) * 100);
    if (percent >= 100) return { status: "Exceeded", color: "#dc2626", percent };
    if (percent >= 85) return { status: "Critical", color: "#ef4444", percent };
    if (percent >= 75) return { status: "Warning", color: "#f59e0b", percent };
    return { status: "Safe", color: "#10b981", percent };
  };

  const getSpentForCategory = (catName) => {
    if (categorySpending[catName] !== undefined) return categorySpending[catName];
    const lower = catName.toLowerCase();
    for (const [key, val] of Object.entries(categorySpending)) {
      if (key.toLowerCase() === lower) return val;
    }
    if (lower === "fashion") {
      const fashionCats = ["dress", "top", "shirt", "jacket", "jeans", "kurti", "skirt", "fashion"];
      let total = 0;
      for (const [key, val] of Object.entries(categorySpending)) {
        if (fashionCats.includes(key.toLowerCase())) total += val;
      }
      return total;
    }
    if (lower === "home & kitchen" || lower === "home and kitchen") {
      let total = 0;
      for (const [key, val] of Object.entries(categorySpending)) {
        const k = key.toLowerCase();
        if (k === "home" || k === "kitchen" || k === "home & kitchen" || k === "home and kitchen") total += val;
      }
      return total;
    }
    return 0;
  };

  const handleAddCategoryBudget = (e) => {
    e.preventDefault();
    if (!catBudgetCategory) {
      showToast("Please select a category.", "warning");
      return;
    }
    const allowedCategories = ["Fashion", "Electronics", "Books", "Beauty", "Home & Kitchen", "Sports", "Accessories"];
    if (!allowedCategories.includes(catBudgetCategory)) {
      showToast("Invalid category selected.", "error");
      return;
    }
    if (!catBudgetAmount) {
      showToast("Please enter a budget amount.", "warning");
      return;
    }
    const parsedAmount = parseFloat(catBudgetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("Budget amount must be greater than zero.", "warning");
      return;
    }
    const allowedTypes = ["Weekly", "Monthly", "Yearly"];
    if (!allowedTypes.includes(catBudgetType)) {
      showToast("Invalid budget cycle selected.", "error");
      return;
    }

    const payload = {
      userId: user.id,
      category: catBudgetCategory,
      budgetAmount: parsedAmount,
      budgetType: catBudgetType
    };

    fetch("http://localhost:8080/analytics/category-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text || "Failed to save category budget"); });
        }
        return res.json();
      })
      .then(data => {
        setCatBudgetSuccess(true);
        setTimeout(() => setCatBudgetSuccess(false), 3000);
        setCatBudgetCategory("");
        setCatBudgetAmount("");
        setCatBudgetType("Monthly");
        showToast(`${payload.budgetType} budget for ${payload.category} saved successfully!`, "success");
        fetchCategoryBudgets();
      })
      .catch(err => {
        console.error("Error saving category budget:", err);
        showToast("Error saving category budget: " + err.message, "error");
      });
  };

  const handleRemoveCategoryBudget = (catName) => {
    if (!user || !user.id) return;
    fetch(`http://localhost:8080/analytics/category-budget/${user.id}/${catName}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to delete category budget from database");
        }
        return res.json();
      })
      .then(data => {
        setShowCatRemoveModal(null);
        showToast(`${catName} category budget removed successfully.`, "success");
        fetchCategoryBudgets();
      })
      .catch(err => {
        console.error("Error deleting category budget:", err);
        showToast("Error removing category budget: " + err.message, "error");
      });
  };

  // Pre-fill form when selecting a category that already has a budget
  useEffect(() => {
    if (catBudgetCategory && categoryBudgets[catBudgetCategory]) {
      const existing = categoryBudgets[catBudgetCategory];
      setCatBudgetAmount(getCatBudgetAmount(existing).toString());
      setCatBudgetType(getCatBudgetType(existing));
    }
  }, [catBudgetCategory]);

  // Filter category budgets by type
  const filteredCategoryBudgets = Object.entries(categoryBudgets).filter(([catName, catData]) => {
    if (catBudgetFilter === "All") return true;
    return (catData?.budgetType) === catBudgetFilter;
  });

  // Generate category alerts
  const categoryAlerts = Object.entries(categoryBudgets).map(([catName, catData]) => {
    const budgetAmt = catData.amount;
    const spent = catData.spent;
    const percent = catData.percentUsed;
    const bType = catData.budgetType;
    const status = catData.status;

    if (status === "Exceeded") {
      return { catName, type: "exceeded", percent, spent, budget: budgetAmt, budgetType: bType };
    }
    if (status === "Warning" || status === "Critical") {
      return { catName, type: "warning", percent, spent, budget: budgetAmt, budgetType: bType };
    }
    return null;
  }).filter(Boolean);


  const fetchBudget = () => {
    if (!user || !user.id) return;
    setLoading(true);
    fetch(`http://localhost:8080/analytics/budget/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch budget details");
        return res.json();
      })
      .then((data) => {
        if (data && data.budgetAmount > 0) {
          setBudgetData(data);
        } else {
          setBudgetData(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBudget();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid budget amount.");
      return;
    }

    const payload = {
      userId: user.id,
      amount: parseFloat(amount),
      budgetType: type
    };

    fetch("http://localhost:8080/analytics/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update budget");
        return res.json();
      })
      .then((data) => {
        setSubmitSuccess(true);
        setShowEditForm(false);
        setTimeout(() => setSubmitSuccess(false), 3000);
        fetchBudget();
      })
      .catch((err) => {
        console.error(err);
        showToast("Error saving budget: " + err.message);
      });
  };

  const handleRemoveBudget = () => {
    if (!user || !user.id) return;
    setRemoving(true);
    fetch(`http://localhost:8080/analytics/budget/${user.id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove budget");
        return res.json();
      })
      .then((data) => {
        setShowRemoveModal(false);
        setRemoving(false);
        showToast("Budget removed successfully.", "success");
        fetchBudget();
      })
      .catch((err) => {
        console.error(err);
        setRemoving(false);
        setShowRemoveModal(false);
        showToast("Error removing budget: " + err.message, "error");
      });
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "3rem", textAlign: "center", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ color: "#2563EB", margin: "1.5rem 0 1rem 0" }}>Access Denied</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Please log in to view your Budget Manager.</p>
          <button onClick={() => navigate("/login")} className="confirm-button" style={{ backgroundColor: "#2563EB", width: "100%" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const percent = budgetData ? Math.round(budgetData.percentUsed || 0) : 0;
  const alertLevel = budgetData?.alertLevel || "Safe";
  const isSafe = alertLevel === "Safe";
  const isWarning = alertLevel === "Warning";
  const isCritical = alertLevel === "Critical" || alertLevel === "Exceeded";

  let alertConfig = {
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Safe Mode",
    insight: "You are spending within your budget.",
    icon: "✅"
  };

  if (isWarning) {
    alertConfig = {
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
      label: "Warning Mode",
      insight: "You are approaching your budget limit.",
      icon: <LuTriangleAlert />
    };
  } else if (isCritical) {
    alertConfig = {
      color: "#ef4444",
      bg: "#fee2e2",
      border: "#fca5a5",
      label: "Critical Alert",
      insight: "You have exceeded your budget.",
      icon: "🚨"
    };
  }

  // New Enhancement Calculations
  const cycleType = budgetData?.budgetType || type || "Monthly";

  const getCyclePeriod = (cycleType) => {
    const now = new Date();
    const formatOptions = { day: 'numeric', month: 'short' };
    if (cycleType === "Weekly") {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${monday.toLocaleDateString('en-US', formatOptions)} → ${sunday.toLocaleDateString('en-US', formatOptions)}`;
    } else if (cycleType === "Monthly") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return `${firstDay.toLocaleDateString('en-US', formatOptions)} → ${lastDay.toLocaleDateString('en-US', formatOptions)}`;
    } else {
      const currentYear = now.getFullYear();
      return `1 Jan → 31 Dec`;
    }
  };

  const getDaysRemaining = (cycleType) => {
    const now = new Date();
    if (cycleType === "Weekly") {
      const day = now.getDay();
      return day === 0 ? 0 : 7 - day;
    } else if (cycleType === "Monthly") {
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return lastDay - now.getDate();
    } else {
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      const diffTime = Math.abs(endOfYear - now);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  };

  const getResetDate = (cycleType) => {
    const now = new Date();
    const formatOptions = { day: 'numeric', month: 'long' };
    if (cycleType === "Weekly") {
      const day = now.getDay();
      const daysToMonday = day === 0 ? 1 : 8 - day;
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + daysToMonday);
      return nextMonday.toLocaleDateString('en-US', formatOptions);
    } else if (cycleType === "Monthly") {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return nextMonth.toLocaleDateString('en-US', formatOptions);
    } else {
      const nextYear = new Date(now.getFullYear() + 1, 0, 1);
      return `January 1, ${nextYear.getFullYear()}`;
    }
  };

  const daysRemaining = budgetData ? getDaysRemaining(cycleType) : "—";
  const cyclePeriod = budgetData ? getCyclePeriod(cycleType) : "—";
  const resetDate = budgetData ? getResetDate(cycleType) : "—";

  // budget health classification
  const getHealthConfig = (percentUsed, remaining, cycleType) => {
    const now = new Date();
    let cycleProgress = 0;
    if (cycleType === "Weekly") {
      const day = now.getDay();
      const dayIndex = day === 0 ? 7 : day;
      cycleProgress = (dayIndex / 7) * 100;
    } else if (cycleType === "Monthly") {
      const currentDay = now.getDate();
      const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      cycleProgress = (currentDay / totalDays) * 100;
    } else {
      const start = new Date(now.getFullYear(), 0, 1);
      const diff = now - start;
      cycleProgress = (Math.floor(diff / (1000 * 60 * 60 * 24)) / 365) * 100;
    }

    if (percentUsed >= 100) {
      return {
        label: "Critical",
        color: "#ef4444",
        bg: "#fee2e2",
        border: "#fca5a5",
        insight: "You have exceeded your planned budget limit.",
        indicatorColor: "#ef4444"
      };
    }

    const ratio = percentUsed / Math.max(cycleProgress, 1);

    if (percentUsed >= 85 || ratio > 1.2) {
      return {
        label: "Critical",
        color: "#ef4444",
        bg: "#fee2e2",
        border: "#fca5a5",
        insight: "Exhausting budget much faster than normal.",
        indicatorColor: "#ef4444"
      };
    } else if (percentUsed >= 65 || ratio > 1.0) {
      return {
        label: "Warning",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
        insight: "Approaching budget limits relative to progress.",
        indicatorColor: "#f59e0b"
      };
    } else if (percentUsed >= 35 || ratio > 0.75) {
      return {
        label: "Good",
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
        insight: "Spending speed matches your cycle timeline.",
        indicatorColor: "#3b82f6"
      };
    } else {
      return {
        label: "Excellent",
        color: "#10b981",
        bg: "#ecfdf5",
        border: "#a7f3d0",
        insight: "You are currently spending within your planned budget.",
        indicatorColor: "#10b981"
      };
    }
  };

  const healthConfig = budgetData ? getHealthConfig(percent, budgetData?.remaining || 0, cycleType) : {
    label: "—",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    insight: "No budget limit configured.",
    indicatorColor: "#64748b"
  };

  const cycleProgressPercent = budgetData ? (() => {
    const now = new Date();
    if (cycleType === "Weekly") {
      const day = now.getDay();
      const dayIndex = day === 0 ? 7 : day;
      return (dayIndex / 7) * 100;
    } else if (cycleType === "Monthly") {
      const currentDay = now.getDate();
      const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return (currentDay / totalDays) * 100;
    } else {
      const start = new Date(now.getFullYear(), 0, 1);
      const diff = now - start;
      return (Math.floor(diff / (1000 * 60 * 60 * 24)) / 365) * 100;
    }
  })() : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "white", borderBottom: "2px solid #DBEAFE" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back">
            <IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
          </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home">
            <IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link>
          <h1 style={{ color: "#2563EB", margin: 0, fontSize: "1.8rem", fontWeight: "bold", marginLeft: "0.5rem" }}>Smart Budget Manager</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineHome />
          </Link>
          <Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div>
          </Link>
          <Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="nav-icon-container"><LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div>
          </Link>
          <Link to="/expense-tracker" className="home-icon" title="Expense Tracker" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineInsights />
          </Link>
          <Link to="/profile" className="home-icon" title="Profile" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlinePerson />
          </Link>
          <Link to="/achievements" className="home-icon" title="Achievements" style={{ display: "inline-flex", alignItems: "center" }}>
            <MdOutlineEmojiEvents />
          </Link>
          <Link to="/budget-manager" className="home-icon" title="Budget Manager" style={{ display: "inline-flex", alignItems: "center", color: "#2563EB" }}>
            <MdOutlineAccountBalanceWallet />
          </Link>
          <NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          <button
            onClick={handleLogout}
            className="logout-button"
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#dc3545", color: "white" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Remove Budget Confirmation Modal */}
      {showRemoveModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "white", borderRadius: "1.25rem", padding: "2.5rem", maxWidth: "440px", width: "90%", boxShadow: "0 25px 60px rgba(0,0,0,0.15)", textAlign: "center", animation: "slideUp 0.3s ease", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #FEE2E2, #FECACA)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", fontSize: "1.75rem" }}>⚠️</div>
            <h3 style={{ color: "#1E293B", margin: "0 0 0.75rem 0", fontSize: "1.4rem", fontWeight: "800" }}>Remove Budget?</h3>
            <p style={{ color: "#64748B", margin: "0 0 0.5rem 0", fontSize: "0.95rem", lineHeight: "1.6" }}>Your spending history and analytics will remain intact.</p>
            <p style={{ color: "#64748B", margin: "0 0 2rem 0", fontSize: "0.95rem", lineHeight: "1.6", fontWeight: "600" }}>Only the active budget will be removed.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                style={{ flex: 1, padding: "0.8rem 1.5rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0", backgroundColor: "white", color: "#475569", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
              >Cancel</button>
              <button
                onClick={handleRemoveBudget}
                disabled={removing}
                style={{ flex: 1, padding: "0.8rem 1.5rem", borderRadius: "0.75rem", border: "none", background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "white", fontWeight: "700", fontSize: "0.95rem", cursor: removing ? "not-allowed" : "pointer", opacity: removing ? 0.7 : 1, transition: "all 0.2s ease", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
                onMouseEnter={(e) => { if (!removing) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)"; }}
              >{removing ? "Removing..." : "Remove Budget"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Category Budget Confirmation Modal */}
      {showCatRemoveModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "white", borderRadius: "1.25rem", padding: "2.5rem", maxWidth: "440px", width: "90%", boxShadow: "0 25px 60px rgba(0,0,0,0.15)", textAlign: "center", animation: "slideUp 0.3s ease", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #FEE2E2, #FECACA)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", fontSize: "1.75rem" }}>🗑️</div>
            <h3 style={{ color: "#1E293B", margin: "0 0 0.75rem 0", fontSize: "1.4rem", fontWeight: "800" }}>Remove {showCatRemoveModal} Budget?</h3>
            <p style={{ color: "#64748B", margin: "0 0 0.5rem 0", fontSize: "0.95rem", lineHeight: "1.6" }}>Your overall budget, orders, analytics, and history will remain intact.</p>
            <p style={{ color: "#64748B", margin: "0 0 2rem 0", fontSize: "0.95rem", lineHeight: "1.6", fontWeight: "600" }}>Only the <strong>{showCatRemoveModal}</strong> category budget will be removed.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowCatRemoveModal(null)}
                style={{ flex: 1, padding: "0.8rem 1.5rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0", backgroundColor: "white", color: "#475569", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
              >Cancel</button>
              <button
                onClick={() => handleRemoveCategoryBudget(showCatRemoveModal)}
                style={{ flex: 1, padding: "0.8rem 1.5rem", borderRadius: "0.75rem", border: "none", background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "white", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)"; }}
              >Remove Budget</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "2.5rem", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Budget Mode Toggle */}
          <div style={{ background: "white", padding: "1.25rem 2rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ color: "#1E293B", margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: "700" }}>Budget View</h3>
              <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.8rem", fontWeight: "500" }}>Choose which budgets to display</p>
            </div>
            <div className="budget-mode-toggle">
              <button className={`budget-mode-btn ${budgetMode === 'overall' ? 'active' : ''}`} onClick={() => setBudgetMode('overall')}>Overall</button>
              <button className={`budget-mode-btn ${budgetMode === 'category' ? 'active' : ''}`} onClick={() => setBudgetMode('category')}>Category</button>
              <button className={`budget-mode-btn ${budgetMode === 'both' ? 'active' : ''}`} onClick={() => setBudgetMode('both')}>Both</button>
            </div>
          </div>

          {/* ===== OVERALL BUDGET SECTION ===== */}
          {(budgetMode === 'overall' || budgetMode === 'both') && (
            <>
              {/* Smart Budget Form Panel - Show when editing or when no budget exists */}
              {(showEditForm || !budgetData) && !loading ? (
                <div style={{ background: "white", padding: "2.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <h3 style={{ color: "#2563EB", margin: "0 0 1.5rem 0", fontSize: "1.4rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span><LuSettings /></span> {budgetData ? "Edit Spending Budget" : "Set Spending Budget"}
                  </h3>

                  {submitSuccess && (
                    <div style={{ backgroundColor: "#d1fae5", border: "1px solid #10b981", color: "#065f46", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontWeight: "bold" }}>
                      ✨ Budget updated successfully!
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "#4b5563", marginBottom: "0.5rem" }}>Budget Amount(₹)</label>
                      <input
                        type="number"
                        placeholder="Enter limit, e.g. 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem" }}
                        required
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "#4b5563", marginBottom: "0.5rem" }}>Budget Cycle</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", backgroundColor: "white" }}
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button type="submit" className="confirm-button" style={{ backgroundColor: "#2563EB", height: "45px", margin: 0, padding: "0 2rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        Save Budget
                      </button>
                      {showEditForm && (
                        <button type="button" onClick={() => setShowEditForm(false)} style={{ height: "45px", margin: 0, padding: "0 1.5rem", borderRadius: "0.5rem", border: "1px solid #E2E8F0", backgroundColor: "white", color: "#64748B", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : budgetData && !loading ? (
                /* Edit Budget & Remove Budget action buttons when active budget exists */
                <div style={{ background: "white", padding: "2rem 2.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ color: "#2563EB", margin: "0 0 0.25rem 0", fontSize: "1.3rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span><LuWallet /></span> Active Budget
                    </h3>
                    <p style={{ margin: 0, color: "#64748B", fontSize: "0.9rem" }}>₹{(budgetData?.budgetAmount || 0).toLocaleString("en-IN")} • {budgetData?.budgetType || "Monthly"} Cycle</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={() => { setShowEditForm(true); setAmount(budgetData?.budgetAmount?.toString() || ""); setType(budgetData?.budgetType || "Monthly"); }}
                      style={{ padding: "0.7rem 1.5rem", borderRadius: "0.6rem", border: "1px solid #2563EB", backgroundColor: "white", color: "#2563EB", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
                    >
                      <LuPencil style={{ fontSize: "0.9rem" }} /> Edit Budget
                    </button>
                    <button
                      onClick={() => setShowRemoveModal(true)}
                      style={{ padding: "0.7rem 1.5rem", borderRadius: "0.6rem", border: "1px solid #FCA5A5", backgroundColor: "white", color: "#EF4444", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
                    >
                      <LuTrash2 style={{ fontSize: "0.9rem" }} /> Remove Budget
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Budget Dashboard Display */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.1rem", color: "#2563EB", fontWeight: "bold" }}>
                  Retrieving budget stats...
                </div>
              ) : budgetData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                  {/* Dashboard stats cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                      <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}> Budget limit</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1f2937", marginTop: "0.5rem" }}>₹{budgetData?.budgetAmount || 0}</div>
                      <span style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: "bold", backgroundColor: "#DBEAFE", padding: "0.2rem 0.5rem", borderRadius: "0.5rem", display: "inline-block", marginTop: "0.5rem" }}> {cycleType} Cycle</span>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                      <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}> Total Spent</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ef4444", marginTop: "0.5rem" }}>₹{budgetData?.spent || 0}</div>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                      <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}> Remaining Budget</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10b981", marginTop: "0.5rem" }}>₹{budgetData?.remaining || 0}</div>
                    </div>
                  </div>

                  {/* Dedicated Enhanced Cards Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                    {/* 1. Budget Cycle Card */}
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}>📅 Budget Cycle</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#2563EB", marginTop: "0.5rem" }}>
                          {cycleType === "Weekly" ? "Monday → Sunday" : cycleType === "Monthly" ? "1st Day → Last Day" : "1 January → 31 December"}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#4b5563", marginTop: "0.5rem", fontWeight: "600", borderTop: "1px dashed #E2E8F0", paddingTop: "0.5rem" }}>
                        Range: {cyclePeriod}
                      </div>
                    </div>

                    {/* 2. Days Remaining Card */}
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}>⏳ Days Remaining</div>
                        <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#2563EB", marginTop: "0.25rem" }}>{daysRemaining}</div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#4b5563", marginTop: "0.5rem", borderTop: "1px dashed #E2E8F0", paddingTop: "0.5rem" }}>
                        You have {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining in this budget cycle.
                      </div>
                    </div>

                    {/* 3. Next Reset Date Card */}
                    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}>🔄 Next Reset Date</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1f2937", marginTop: "0.5rem" }}>{resetDate.split(',')[0]}</div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#4b5563", marginTop: "0.5rem", borderTop: "1px dashed #E2E8F0", paddingTop: "0.5rem" }}>
                        Your budget will reset on {resetDate.split(',')[0]}.
                      </div>
                    </div>

                    {/* 4. Budget Health Card */}
                    <div style={{ backgroundColor: healthConfig.bg, padding: "1.5rem", borderRadius: "1rem", border: `1px solid ${healthConfig.border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}>💚 Budget Health</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: "900", color: healthConfig.color, marginTop: "0.25rem" }}>{healthConfig.label}</div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: healthConfig.color, fontWeight: "bold", marginTop: "0.5rem", borderTop: `1px dashed ${healthConfig.border}`, paddingTop: "0.5rem" }}>
                        {healthConfig.insight}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Visual Timeline Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                    {/* Visual Circle & Progress Bar Card */}
                    <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <h4 style={{ color: "#374151", margin: 0, fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>📊</span> Budget Usage & progress
                      </h4>

                      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", width: "130px" }}>
                          <svg width="120" height="120" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                            <circle
                              cx="80"
                              cy="80"
                              r="65"
                              fill="transparent"
                              stroke="#f3f4f6"
                              strokeWidth="12"
                            />
                            <circle
                              cx="80"
                              cy="80"
                              r="65"
                              fill="transparent"
                              stroke={alertConfig.color}
                              strokeWidth="12"
                              strokeDasharray={2 * Math.PI * 65}
                              strokeDashoffset={2 * Math.PI * 65 * (1 - Math.min(percent, 100) / 100)}
                              strokeLinecap="round"
                              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                            />
                          </svg>
                          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                            <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#374151" }}>{percent}%</span>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Used</div>
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: "180px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#4b5563" }}>
                            <span>Cycle Consumption Bar</span>
                            <span style={{ fontWeight: "bold", color: healthConfig.color }}>{percent}%</span>
                          </div>
                          <div style={{ backgroundColor: "#F1F5F9", borderRadius: "9999px", height: "12px", width: "100%", overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                borderRadius: "9999px",
                                width: `${Math.min(percent, 100)}%`,
                                backgroundColor: healthConfig.indicatorColor,
                                transition: "width 1s ease-out"
                              }}
                            />
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "4px" }}>
                            {percent > 100
                              ? `You have exceeded your limit by ₹${Math.abs(budgetData?.remaining || 0)}.`
                              : `Remaining buffer: ₹${(budgetData?.remaining || 0).toLocaleString("en-IN")}`
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Style Budget Period Card */}
                    <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <h4 style={{ color: "#374151", margin: 0, fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>📅</span> Timeline Style Budget Period
                      </h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", height: "100%", paddingBottom: "0.5rem" }}>
                        <div style={{ position: "relative", padding: "10px 0" }}>
                          <div style={{ height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", width: "100%", position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                left: `${cycleProgressPercent}%`,
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "16px",
                                height: "16px",
                                backgroundColor: "#2563EB",
                                border: "3px solid white",
                                borderRadius: "50%",
                                boxShadow: "0 0 8px rgba(37, 99, 235, 0.5)",
                                transition: "left 0.5s ease"
                              }}
                              title="Today"
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748B", fontWeight: "600" }}>
                          <span>{cycleType === "Weekly" ? "Monday" : cycleType === "Monthly" ? "1st Day" : "1 January"}</span>
                          <span style={{ color: "#2563EB" }}>Today ({Math.round(cycleProgressPercent)}% Elapsed)</span>
                          <span>{cycleType === "Weekly" ? "Sunday" : cycleType === "Monthly" ? "Last Day" : "31 December"}</span>
                        </div>

                        <div style={{ backgroundColor: "#F8FAFC", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #E2E8F0", fontSize: "0.85rem", color: "#4b5563" }}>
                          <strong>Active Cycle:</strong> {cyclePeriod}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alert Card & Smart Insights */}
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    {/* Alert Panel */}
                    <div style={{
                      flex: "1 1 400px",
                      backgroundColor: alertConfig.bg,
                      border: `1px solid ${alertConfig.border}`,
                      color: alertConfig.color,
                      padding: "2rem",
                      borderRadius: "1rem",
                      display: "flex",
                      gap: "1.25rem",
                      alignItems: "flex-start",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.01)"
                    }}>
                      <span style={{ fontSize: "2.5rem", flexShrink: 0 }}> {alertConfig.icon}</span>
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "1.25rem" }}> {alertConfig.label}</h4>
                        <p style={{ margin: "0 0 0.25rem 0", fontSize: "1.05rem", fontWeight: "600" }}>
                          You have used {percent}% of your {cycleType.toLowerCase()} budget.
                        </p>
                        <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9 }}>
                          {percent > 100 ? (
                            <span> You have exceeded your limit by ₹{Math.abs(budgetData?.remaining || 0)}.</span>
                          ) : (
                            <span> Only ₹{budgetData?.remaining || 0} remains in your budget.</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Smart Insights Callout */}
                    <div style={{ flex: "1 1 300px", background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                      <h4 style={{ color: "#374151", margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>💡</span> AI Budget Insights
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
                        <span style={{ fontSize: "1.25rem" }}> <LuBot /></span>
                        <span style={{ fontWeight: "600", color: "#4b5563" }}>
                          {healthConfig.insight}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ background: "linear-gradient(135deg, #FFFFFF, #F0F7FF)", padding: "4rem 2rem", borderRadius: "1.25rem", border: "2px dashed #BFDBFE", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(37, 99, 235, 0.1))", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(37, 99, 235, 0.08))", pointerEvents: "none" }} />
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", fontSize: "2.5rem" }}>💰</div>
                  <h3 style={{ color: "#1E3A8A", margin: "0 0 0.75rem 0", fontSize: "1.6rem", fontWeight: "800" }}>No Budget Set</h3>
                  <p style={{ color: "#64748B", maxWidth: "420px", margin: "0 auto 2rem auto", lineHeight: "1.7", fontSize: "1rem" }}>
                    Set a weekly, monthly, or yearly budget to track spending and receive smart recommendations.
                  </p>
                  <button
                    onClick={() => setShowEditForm(true)}
                    style={{ padding: "0.85rem 2.5rem", borderRadius: "0.75rem", border: "none", background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white", fontWeight: "700", fontSize: "1rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "all 0.3s ease", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.35)"; }}
                  >
                    <LuPlus /> Set Budget
                  </button>
                </div>
              )}
            </>
          )}

          {/* ===== CATEGORY BUDGET SECTION ===== */}
          {(budgetMode === 'category' || budgetMode === 'both') && (
            <>
              {/* Section Divider */}
              {budgetMode === 'both' && <div className="budget-section-divider" />}

              {/* Category Budget Form */}
              <div style={{ background: "white", padding: "2rem 2.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.12)", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                <h3 style={{ color: "#2563EB", margin: "0 0 0.25rem 0", fontSize: "1.3rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🏷️</span> Category Budgets
                </h3>
                <p style={{ color: "#94A3B8", margin: "0 0 1.5rem 0", fontSize: "0.85rem", fontWeight: "500" }}>
                  Set spending limits for individual categories
                </p>

                {catBudgetSuccess && (
                  <div style={{ backgroundColor: "#d1fae5", border: "1px solid #10b981", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "0.5rem", marginBottom: "1rem", fontWeight: "bold", fontSize: "0.9rem" }}>
                    ✨ Category budget saved successfully!
                  </div>
                )}

                <form onSubmit={handleAddCategoryBudget} className="category-budget-form">
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#4b5563", marginBottom: "0.4rem" }}>Category</label>
                    <select
                      value={catBudgetCategory}
                      onChange={(e) => setCatBudgetCategory(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="">Select category...</option>
                      {budgetCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name} {categoryBudgets[cat.name] ? `(₹${getCatBudgetAmount(categoryBudgets[cat.name]).toLocaleString('en-IN')} ${getCatBudgetType(categoryBudgets[cat.name])})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "1 1 140px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#4b5563", marginBottom: "0.4rem" }}>Budget Cycle</label>
                    <select
                      value={catBudgetType}
                      onChange={(e) => setCatBudgetType(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 160px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#4b5563", marginBottom: "0.4rem" }}>Budget Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3000"
                      value={catBudgetAmount}
                      onChange={(e) => setCatBudgetAmount(e.target.value)}
                      style={{ width: "100%" }}
                      min="1"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button
                      type="submit"
                      className="confirm-button"
                      style={{ backgroundColor: "#2563EB", height: "42px", margin: 0, padding: "0 1.5rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
                    >
                      <LuPlus style={{ fontSize: "0.9rem" }} /> {categoryBudgets[catBudgetCategory] ? 'Update' : 'Add'} Budget
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Budget Alerts */}
              {categoryAlerts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {categoryAlerts.map((alert, idx) => (
                    <div key={idx} className={`category-budget-alert ${alert.type === 'exceeded' ? 'exceeded-alert' : 'warning-alert'}`}>
                      <span className="alert-icon">{alert.type === 'exceeded' ? '🚨' : '⚠️'}</span>
                      <span>
                        <strong>{alert.catName}</strong> <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>({alert.budgetType})</span>: {alert.type === 'exceeded'
                          ? `Budget exceeded! Spent ₹${Math.round(alert.spent).toLocaleString('en-IN')} of ₹${alert.budget.toLocaleString('en-IN')} (${alert.percent}%)`
                          : `Approaching limit — ${alert.percent}% used (₹${Math.round(alert.spent).toLocaleString('en-IN')} of ₹${alert.budget.toLocaleString('en-IN')})`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Category Budget Filter */}
              {Object.keys(categoryBudgets).length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748B" }}>Filter by:</span>
                  <div className="budget-mode-toggle">
                    {["All", "Weekly", "Monthly", "Yearly"].map(f => (
                      <button
                        key={f}
                        className={`budget-mode-btn ${catBudgetFilter === f ? 'active' : ''}`}
                        onClick={() => setCatBudgetFilter(f)}
                      >{f === 'All' ? 'View All' : f}</button>
                    ))}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "500", marginLeft: "auto" }}>
                    {filteredCategoryBudgets.length} of {Object.keys(categoryBudgets).length} budgets
                  </span>
                </div>
              )}

              {/* Category Budget Cards Grid */}
              {filteredCategoryBudgets.length > 0 ? (
                <div className="category-budget-grid">
                  {filteredCategoryBudgets.map(([catName, catData]) => {
                    const budgetAmt = catData.amount;
                    const bType = catData.budgetType;
                    const spent = Math.round(catData.spent || 0);
                    const remaining = Math.round(catData.remaining || 0);
                    const percent = catData.percentUsed || 0;
                    const status = catData.status || "Safe";
                    const statusClass = status.toLowerCase();

                    let color = "#10b981"; // Safe
                    if (status === "Warning") color = "#f59e0b";
                    else if (status === "Critical") color = "#ef4444";
                    else if (status === "Exceeded") color = "#dc2626";

                    return (
                      <div key={catName} className={`category-budget-card status-${statusClass}`}>
                        {/* Header */}
                        <div className="cat-budget-header">
                          <div className="cat-budget-title">
                            <div className="cat-budget-icon">{getCategoryIcon(catName)}</div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span className="cat-budget-name">{catName}</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: "600", color: "#2563EB", backgroundColor: "#EFF6FF", padding: "1px 8px", borderRadius: "9999px", width: "fit-content", marginTop: "2px" }}>{bType}</span>
                            </div>
                          </div>
                          <button
                            className="cat-budget-delete-btn"
                            onClick={() => setShowCatRemoveModal(catName)}
                            title={`Remove ${catName} budget`}
                          >
                            <LuTrash2 />
                          </button>
                        </div>

                        {/* Stats */}
                        <div className="cat-budget-stats">
                          <div className="cat-budget-stat">
                            <span className="cat-budget-stat-label">Budget</span>
                            <span className="cat-budget-stat-value">₹{budgetAmt.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="cat-budget-stat">
                            <span className="cat-budget-stat-label">Spent</span>
                            <span className="cat-budget-stat-value" style={{ color: percent >= 100 ? '#dc2626' : '#475569' }}>₹{spent.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="cat-budget-stat">
                            <span className="cat-budget-stat-label">Remaining</span>
                            <span className="cat-budget-stat-value" style={{ color: remaining < 0 ? '#dc2626' : '#10b981' }}>
                              {remaining < 0 ? `-₹${Math.abs(remaining).toLocaleString('en-IN')}` : `₹${remaining.toLocaleString('en-IN')}`}
                            </span>
                          </div>
                          <div className="cat-budget-stat">
                            <span className="cat-budget-stat-label">Used</span>
                            <span className="cat-budget-stat-value" style={{ color }}>{percent}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="category-budget-progress">
                          <div
                            className={`category-budget-progress-fill status-${statusClass}`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>

                        {/* Footer */}
                        <div className="cat-budget-footer">
                          <span className="cat-budget-percent" style={{ color }}>{percent}% Used</span>
                          <span className={`budget-status-badge ${statusClass}`}>
                            {status === 'Safe' && '✓'} {status === 'Warning' && '⚠'} {status === 'Critical' && '!'} {status === 'Exceeded' && '✕'} {status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : Object.keys(categoryBudgets).length > 0 ? (
                <div style={{ background: "linear-gradient(135deg, #FFFFFF, #F0F7FF)", padding: "2.5rem 2rem", borderRadius: "1rem", border: "2px dashed #BFDBFE", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</div>
                  <h3 style={{ color: "#1E3A8A", margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "800" }}>No {catBudgetFilter} Budgets</h3>
                  <p style={{ color: "#64748B", maxWidth: "380px", margin: "0 auto", lineHeight: "1.6", fontSize: "0.9rem" }}>
                    No category budgets match the "{catBudgetFilter}" filter. Try selecting a different filter or add a new {catBudgetFilter.toLowerCase()} budget.
                  </p>
                </div>
              ) : (
                <div style={{ background: "linear-gradient(135deg, #FFFFFF, #F0F7FF)", padding: "3rem 2rem", borderRadius: "1rem", border: "2px dashed #BFDBFE", textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏷️</div>
                  <h3 style={{ color: "#1E3A8A", margin: "0 0 0.5rem 0", fontSize: "1.3rem", fontWeight: "800" }}>No category budgets found</h3>
                  <p style={{ color: "#64748B", maxWidth: "380px", margin: "0 auto", lineHeight: "1.6", fontSize: "0.95rem" }}>
                    Add budgets for specific categories like Fashion, Electronics, or Books to track your spending per category.
                  </p>
                </div>
              )}
            </>
          )}

        </div >
      </div >
    </div >
  );
}

function AchievementsPage({ user, handleLogout, notifications, markNotificationAsRead, cart, wishlist }) {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState(null);
  const [dnaScore, setDnaScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchAchievements = fetch(`http://localhost:8080/analytics/achievements/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch achievements");
        return res.json();
      });

    const fetchDnaScore = fetch(`http://localhost:8080/analytics/dna-score/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch DNA score");
        return res.json();
      })
      .catch((err) => {
        console.error("Error fetching DNA score for achievements:", err);
        return null;
      });

    Promise.all([fetchAchievements, fetchDnaScore])
      .then(([achData, scoreData]) => {
        setAchievements(achData);
        setDnaScore(scoreData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      < div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        < div style={{ backgroundColor: "white", border: "2px solid #DBEAFE", borderRadius: "1rem", padding: "3rem", textAlign: "center", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          < span style={{ fontSize: "4rem" }}>🔒</span >
          < h2 style={{ color: "#2563EB", margin: "1.5rem 0 1rem 0" }}> Access Denied</h2 >
          < p style={{ color: "#666", marginBottom: "2rem" }}> Please log in to view your achievements and badges.</p >
          < button onClick={() => navigate("/login")} className="confirm-button" style={{ backgroundColor: "#2563EB", width: "100%" }}>
            Go to Login
          </button >
        </div >
      </div >
    );
  }

  const badgeMetadata = {
    "First Purchase": { icon: "🌱", desc: "Welcome to the club! Placed your first order on our store." },
    "5 Orders Club": { icon: "🥉", desc: "Successfully placed 5 orders on our store." },
    "10 Orders Club": { icon: "🥈", desc: "Successfully placed 10 orders on our store." },
    "₹10,000 Club": { icon: <LuWallet />, desc: "Spent over ₹10,000 on purchases in our store." },
    "Discount Hunter": { icon: <LuTag />, desc: "You saved significantly using discounts and offers." },
    "Budget Master": { icon: <LuScale />, desc: "Kept your monthly spending within planned budgets." },
    "Tech Enthusiast": { icon: "💻", desc: "Emerged as a primary buyer of technology and gadgets." },
    "Fashion Explorer": { icon: "👗", desc: "Discovered and purchased stylish fashion and apparel." },
    "Knowledge Seeker": { icon: "📚", desc: "Invested in self-growth with books and educational items." },
    "Loyal Customer": { icon: "🤝", desc: "Frequently shopped with us, building a loyal connection." },
    "Premium Shopper": { icon: "💎", desc: "Indulged in high-end, premium, and luxury products." },
    "Elite Shopper": { icon: "👑", desc: "Achieved a Shopping DNA Score above 90." },
    "Impulsive Shopper": { icon: <LuShoppingBag />, desc: "Frequently bought items without overthinking. A true shopper!" },
  };

  const getBadgeDetails = (badgeName) => {
    return badgeMetadata[badgeName] || { icon: <LuTrophy />, desc: "Earned for outstanding shopping behavior." };
  };

  const allPossibleBadges = Array.from(new Set([
    "First Purchase", "5 Orders Club", "10 Orders Club", "₹10,000 Club",
    "Discount Hunter", "Budget Master", "Tech Enthusiast", "Fashion Explorer",
    "Knowledge Seeker", "Loyal Customer", "Premium Shopper", "Elite Shopper",
    "Impulsive Shopper",
    ...(achievements?.badges || [])
  ]));

  const earnedBadges = achievements?.badges || [];
  const totalBadgesEarned = achievements?.totalBadges || earnedBadges.length;
  const mostRecentBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : "None";
  const dnaGrade = dnaScore?.grade || "N/A";

  return (
    < div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Top Header */}
      < div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "white", borderBottom: "2px solid #DBEAFE" }}>
        < div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          < button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} title="Back" >
            < IoArrowBack style={{ fontSize: "1.8rem", color: "black" }} />
          </button >
          < Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} title="Home" >
            < IoHome style={{ fontSize: "1.8rem", color: "black" }} />
          </Link >
          < h1 style={{ color: "#2563EB", margin: 0, fontSize: "1.8rem", fontWeight: "bold", marginLeft: "0.5rem" }}> Achievements & Badges</h1 >
        </div >
        < div style={{ display: "flex", alignItems: "center" }}>
          < Link to="/" className="home-icon" title="Home" style={{ display: "inline-flex", alignItems: "center" }}>
            < MdOutlineHome />
          </Link >
          < Link to="/wishlist" className="home-icon" title="Wishlist" style={{ display: "inline-flex", alignItems: "center" }}>
            < div className="nav-icon-container" > <LuHeart />{wishlist.length > 0 && <span className="icon-badge">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}</div >
          </Link >
          < Link to="/cart" className="home-icon" title="Cart" style={{ display: "inline-flex", alignItems: "center" }}>
            < div className="nav-icon-container" > <LuShoppingCart />{cart.length > 0 && <span className="icon-badge">{cart.length > 99 ? '99+' : cart.length}</span>}</div >
          </Link >
          < Link to="/expense-tracker" className="home-icon" title="Expense Tracker" style={{ display: "inline-flex", alignItems: "center" }}>
            < MdOutlineInsights />
          </Link >
          < Link to="/profile" className="home-icon" title="Profile" style={{ display: "inline-flex", alignItems: "center" }}>
            < MdOutlinePerson />
          </Link >
          < Link to="/achievements" className="home-icon" title="Achievements" style={{ display: "inline-flex", alignItems: "center", color: "#2563EB" }}>
            < MdOutlineEmojiEvents />
          </Link >
          < NotificationBell notifications={notifications} markNotificationAsRead={markNotificationAsRead} user={user} />
          < button
            onClick={handleLogout}
            className="logout-button"
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#dc3545", color: "white" }}
          >
            Logout
          </button >
        </div >
      </div >

      < div style={{ padding: "2.5rem", maxWidth: "1000px", margin: "0 auto" }}>
        {loading ? (
          < div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem", color: "#2563EB", fontWeight: "bold" }}>
            Calculating your shopping accolades...
          </div >
        ) : error ? (
          < div style={{ textAlign: "center", padding: "4rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "1rem", border: "2px solid #fca5a5" }}>
            < h3 > Error loading achievements</h3 >
            < p > {error}</p >
          </div >
        ) : (
          < div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Summary Trophy Card */}
            < div style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706, #b45309)",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              color: "white",
              boxShadow: "0 12px 30px rgba(217, 119, 6, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem"
            }}>
              < div style={{ flex: 1, minWidth: "280px" }}>
                < span style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px", backgroundColor: "rgba(255,255,255,0.2)", padding: "0.3rem 0.8rem", borderRadius: "1rem" }}>
                  < LuTrophy /> Shopper Achievements
                </span >
                < h2 style={{ fontSize: "2.5rem", margin: "1rem 0 0.5rem 0", fontWeight: "900" }}> Your Shopping Milestones</h2 >
                < p style={{ opacity: 0.9, fontSize: "1.05rem", lineHeight: "1.5" }}>
                  Complete achievements and unlock trophies based on your budget control, savings efficiency, category choices, and loyal buying habits.
                </p >
              </div >

              {/* Stat Boxes */}
              < div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                < div style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "1rem", padding: "1.25rem", minWidth: "130px", textAlign: "center" }}>
                  < div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "bold", opacity: 0.9 }}> Earned Badges</div >
                  < div style={{ fontSize: "2.2rem", fontWeight: "900", marginTop: "0.25rem" }}> {totalBadgesEarned}</div >
                </div >
                < div style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "1rem", padding: "1.25rem", minWidth: "130px", textAlign: "center" }}>
                  < div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "bold", opacity: 0.9 }}> DNA Grade</div >
                  < div style={{ fontSize: "2.2rem", fontWeight: "900", marginTop: "0.25rem", color: "#fef08a" }}> {dnaGrade}</div >
                </div >
              </div >
            </div >

            {/* Most Recent Badge Section */}
            {earnedBadges.length > 0 && (
              < div style={{ background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                < div style={{ fontSize: "3.5rem", background: "linear-gradient(135deg, #fffbeb, #fef3c7)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)" }}>
                  {getBadgeDetails(mostRecentBadge).icon}
                </div >
                < div style={{ flex: 1 }}>
                  < span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "bold", color: "#d97706", letterSpacing: "1px" }}> Most Recent Unlock</span >
                  < h3 style={{ margin: "0.25rem 0", fontSize: "1.4rem", fontWeight: "bold", color: "#1f2937" }}> {mostRecentBadge}</h3 >
                  < p style={{ margin: 0, color: "#6b7280", fontSize: "0.95rem" }}> {getBadgeDetails(mostRecentBadge).desc}</p >
                </div >
              </div >
            )}

            {/* Badges Grid */}
            < div style={{ background: "white", padding: "2.5rem", borderRadius: "1rem", border: "1px solid rgba(37, 99, 235, 0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              < h3 style={{ color: "#2563EB", margin: "0 0 2rem 0", fontSize: "1.45rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                < span >🏅</span > Achievement Trophy Room
              </h3 >

              < div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                {allPossibleBadges.map((badgeName, idx) => {
                  const isEarned = earnedBadges.includes(badgeName);
                  const details = getBadgeDetails(badgeName);
                  return (
                    < div key={idx} style={{
                      background: isEarned ? "linear-gradient(135deg, #ffffff, #fffdfa)" : "#f9fafb",
                      border: isEarned ? "1px solid rgba(245, 158, 11, 0.4)" : "1px dashed #e5e7eb",
                      borderRadius: "1rem",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      opacity: isEarned ? 1 : 0.6,
                      boxShadow: isEarned ? "0 4px 12px rgba(245, 158, 11, 0.06)" : "none",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      transform: isEarned ? "none" : "scale(0.98)"
                    }}>
                      < div style={{
                        fontSize: "2.5rem",
                        marginBottom: "1rem",
                        filter: isEarned ? "none" : "grayscale(100%) opacity(40%)",
                        background: isEarned ? "linear-gradient(135deg, #fffbeb, #fef3c7)" : "#f3f4f6",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {details.icon}
                      </div >
                      < h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "700", fontSize: "1.1rem", color: isEarned ? "#1f2937" : "#9ca3af" }}>
                        {badgeName}
                      </h4 >
                      < p style={{ margin: 0, fontSize: "0.85rem", color: isEarned ? "#4b5563" : "#9ca3af", lineHeight: "1.4" }}>
                        {details.desc}
                      </p >

                      {isEarned ? (
                        < span style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: "bold", color: "#10b981", backgroundColor: "#d1fae5", padding: "0.25rem 0.75rem", borderRadius: "1rem", textTransform: "uppercase" }}>
                          Unlocked
                        </span >
                      ) : (
                        < span style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: "bold", color: "#9ca3af", backgroundColor: "#f3f4f6", padding: "0.25rem 0.75rem", borderRadius: "1rem", textTransform: "uppercase" }}>
                          Locked
                        </span >
                      )}
                    </div >
                  );
                })}
              </div >

            </div >

          </div >
        )}
      </div >
    </div >
  );
}

function App() {
  const [toasts, setToasts] = useState([]);

  const triggerToast = useCallback((message, type) => {
    let toastType = type;
    if (!toastType) {
      const msg = (message || "").toLowerCase();
      if (msg.includes("limit") || msg.includes("stock") || msg.includes("nearing") || msg.includes("adjust") || msg.includes("already in")) {
        toastType = "warning";
      } else if (msg.includes("fail") || msg.includes("error") || msg.includes("invalid") || msg.includes("cannot") || msg.includes("fill all") || msg.includes("expired") || msg.includes("log in") || msg.includes("select a payment") || msg.includes("choose a unique") || msg.includes("required") || msg.includes("select or add")) {
        toastType = "error";
      } else if (msg.includes("success") || msg.includes("added") || msg.includes("submitted") || msg.includes("saved") || msg.includes("updated") || msg.includes("confirmed") || msg.includes("registered") || msg.includes("applied") || msg.includes("welcome")) {
        toastType = "success";
      } else {
        toastType = "info";
      }
    }
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type: toastType }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastRef.current = triggerToast;
    return () => {
      toastRef.current = null;
    };
  }, [triggerToast]);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = (userId) => {
    if (!userId) return;
    fetch(`http://localhost:8080/notifications/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  };

  const markNotificationAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/notifications/${id}/read`, {
        method: "PUT"
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      const updated = await res.json();
      setNotifications(prev => prev.map(n => n.id === id ? updated : n));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications(user.id);
      const interval = setInterval(() => {
        fetchNotifications(user.id);
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:8080/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products from backend database.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Products loaded from backend:", data);
        const formattedProducts = data.map((product) => {
          let parsedImages = [];
          try {
            parsedImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
          } catch (e) {
            console.error("Error parsing images for product " + product.id, e);
          }
          let parsedSizes = [];
          try {
            parsedSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
          } catch (e) {
            console.error("Error parsing sizes for product " + product.id, e);
          }
          let parsedColours = [];
          try {
            parsedColours = typeof product.colours === "string" ? JSON.parse(product.colours) : product.colours;
          } catch (e) {
            console.error("Error parsing colours for product " + product.id, e);
          }
          return {
            ...product,
            images: parsedImages || [],
            sizes: parsedSizes || [],
            colours: parsedColours || [],
            brand: product.brand || "",
            stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 0,
            sku: product.sku || "",
            specifications: product.specifications || "",
            warranty: product.warranty || "",
            seller: product.seller || "",
            salesCount: product.salesCount !== undefined ? product.salesCount : 0,
            rating: product.rating !== undefined ? product.rating : 0,
            totalReviews: product.totalReviews !== undefined ? product.totalReviews : 0,
            subCategory: product.subCategory || ""
          };
        });
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCartAndWishlist = async () => {
    if (!user || !user.id || products.length === 0) return;
    try {
      // 1. Fetch Cart
      const cartRes = await fetch(`http://localhost:8080/cart/${user.id}`);
      if (cartRes.ok) {
        const dbCartItems = await cartRes.json();
        const mappedCart = dbCartItems.map(dbItem => {
          const productObj = products.find(p => p.id === dbItem.productId);
          if (productObj) {
            return {
              ...productObj,
              cartDbId: dbItem.id,
              color: dbItem.color,
              size: dbItem.size,
              quantity: dbItem.quantity || 1,
              image: dbItem.image,
              images: dbItem.image
            };
          }
          return null;
        }).filter(item => item !== null);
        setCart(mappedCart);
      }

      // 2. Fetch Wishlist
      const wishlistRes = await fetch(`http://localhost:8080/wishlist/${user.id}`);
      if (wishlistRes.ok) {
        const dbWishlistItems = await wishlistRes.json();
        const mappedWishlist = dbWishlistItems.map(dbItem => {
          const productObj = products.find(p => p.id === dbItem.productId);
          if (productObj) {
            return {
              ...productObj,
              wishlistDbId: dbItem.id,
              color: dbItem.color,
              size: dbItem.size,
              image: dbItem.image,
              images: dbItem.image
            };
          }
          return null;
        }).filter(item => item !== null);
        setWishlist(mappedWishlist);
      }
    } catch (err) {
      console.error("Error fetching cart/wishlist:", err);
    }
  };

  useEffect(() => {
    fetchCartAndWishlist();
  }, [user, products]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    setUser(null);
    setCart([]);
    setWishlist([]);
    showToast("Logged out successfully!");
  };

  const addToCart = (product, size, color) => {
    if (!user || !user.id) {
      showToast("Please log in to add items to your cart.");
      return;
    }

    // Prevent adding quantity beyond available stock
    const existing = cart.find(item => item.id === product.id && item.size === (size || "M") && item.color === (color || "Default"));
    if (existing) {
      const nextQty = (existing.quantity || 1) + 1;
      if (product.stockQuantity !== undefined && nextQty > product.stockQuantity) {
        showToast(`Cannot add more. Only ${product.stockQuantity} items available in stock.`);
        return;
      }
    } else {
      if (product.stockQuantity !== undefined && product.stockQuantity === 0) {
        showToast("This product is out of stock.");
        return;
      }
    }

    const selectedColourObj = product.colours?.find(
      (c) => c.colour === color
    );
    const cartItemImage = selectedColourObj?.image || (product.colours?.[0]?.image || "");

    const payload = {
      userId: user.id,
      productId: product.id,
      color: color || "Default",
      size: size || "M",
      quantity: 1,
      image: cartItemImage
    };

    fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add item to database cart.");
        return res.json();
      })
      .then((dbItem) => {
        const fullItem = {
          ...product,
          cartDbId: dbItem.id,
          color: dbItem.color,
          size: dbItem.size,
          quantity: dbItem.quantity || 1,
          image: dbItem.image,
          images: dbItem.image
        };
        setCart([...cart, fullItem]);
        showToast("Product added to cart!");
      })
      .catch((err) => {
        console.error(err);
        showToast(err.message);
      });
  };

  const removeFromCart = (index) => {
    const item = cart[index];
    if (!item) return;

    if (item.cartDbId) {
      fetch(`http://localhost:8080/cart/${item.cartDbId}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to remove item from database cart.");
          const newCart = [...cart];
          newCart.splice(index, 1);
          setCart(newCart);
        })
        .catch((err) => {
          console.error(err);
          showToast(err.message);
        });
    } else {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const addToWishlist = (product, size, color) => {
    if (!user || !user.id) {
      showToast("Please log in to manage your wishlist.");
      return;
    }

    const selectedColourObj = product.colours?.find(
      (c) => c.colour === color
    );
    const wishlistImage = selectedColourObj?.image || (product.colours?.[0]?.image || "");

    const payload = {
      userId: user.id,
      productId: product.id,
      color: color || "Default",
      size: size || "M",
      image: wishlistImage
    };

    fetch("http://localhost:8080/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add to database wishlist.");
        return res.json();
      })
      .then((dbItem) => {
        const fullItem = {
          ...product,
          wishlistDbId: dbItem.id,
          color: dbItem.color,
          size: dbItem.size,
          image: dbItem.image,
          images: dbItem.image
        };
        setWishlist([...wishlist, fullItem]);
        showToast("Product added to wishlist!");
      })
      .catch((err) => {
        console.error(err);
        showToast(err.message);
      });
  };

  const removeFromWishlist = (index) => {
    const item = wishlist[index];
    if (!item) return;

    if (item.wishlistDbId) {
      fetch(`http://localhost:8080/wishlist/${item.wishlistDbId}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to remove item from database wishlist.");
          const newWishlist = [...wishlist];
          newWishlist.splice(index, 1);
          setWishlist(newWishlist);
        })
        .catch((err) => {
          console.error(err);
          showToast(err.message);
        });
    } else {
      const newWishlist = [...wishlist];
      newWishlist.splice(index, 1);
      setWishlist(newWishlist);
    }
  };


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home user={user} handleLogout={handleLogout} products={products} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/product/:id" element={<ProductPage addToCart={addToCart} addToWishlist={addToWishlist} products={products} fetchProducts={fetchProducts} user={user} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} user={user} notifications={notifications} markNotificationAsRead={markNotificationAsRead} addToCart={addToCart} addToWishlist={addToWishlist} cart={cart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} setCart={setCart} user={user} notifications={notifications} markNotificationAsRead={markNotificationAsRead} wishlist={wishlist} />} />
          <Route path="/address" element={<AddressPage cart={cart} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
          <Route path="/order-confirmed" element={<OrderPlaced />} />
          <Route path="/expense-tracker" element={<ExpenseTrackerPage user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/shopping-insights" element={<ShoppingInsightsPage user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/personality-insights" element={<PersonalityInsightsPage user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/achievements" element={<AchievementsPage user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />
          <Route path="/budget-manager" element={<BudgetManagerPage user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />

          <Route path="/shopping-intelligence" element={<ShoppingIntelligenceDashboard user={user} handleLogout={handleLogout} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/admin-login" element={<AdminLoginPage setUser={setUser} />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage user={user} products={products} setProducts={setProducts} fetchProducts={fetchProducts} cart={cart} wishlist={wishlist} />} />
          <Route path="/add-product" element={<AddProductPage products={products} setProducts={setProducts} user={user} fetchProducts={fetchProducts} />} />

          {/* Profile routes */}
          <Route path="/profile" element={<Profile handleLogout={handleLogout} user={user} notifications={notifications} markNotificationAsRead={markNotificationAsRead} cart={cart} wishlist={wishlist} />}>
            <Route path="details" element={<ProfileDetails />} />
            <Route path="track-orders" element={<TrackOrders />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="exchanged-orders" element={<ExchangedOrders />} />
            <Route path="cancelled-orders" element={<CancelledOrders />} />
            <Route path="notifications" element={<ProfileNotifications />} />
            <Route index element={<ProfileDetails />} /> {/* default subpage */}
          </Route>
        </Routes>
      </Router>
      <ToastContainer toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </>
  );
}

export default App;
