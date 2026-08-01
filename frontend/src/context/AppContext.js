import React, { createContext, useState } from "react";

export const AppContext = createContext();

const initialProducts = [
  { id: 1, name: "Yellow Dress", price: 1399, images: ["/images/yellow-dress.png"], category: "dress", color: "Yellow", size: "M", discount: 10 },
  { id: 2, name: "Shirt", price: 1999, images: { blue: "/images/blue-shirt.png", pink: "/images/pink-shirt.png", yellow: "/images/yellow-shirt.png" }, category: "shirt", color: "Blue", size: "M", discount: 15 },
  { id: 3, name: "Green Top", price: 1099, images: ["/images/green-top.png"], category: "top", color: "Green", size: "M", discount: 5 },
  { id: 4, name: "Beige Jacket", price: 1399, images: ["/images/beige-jacket.png"], category: "jacket", color: "Beige", size: "L", discount: 20 },
  { id: 5, name: "Black Dress", price: 1999, images: ["/images/black-dress.png"], category: "dress", color: "Black", size: "S", discount: 12 },
  { id: 6, name: "Black Skirt", price: 1099, images: ["/images/black-skirt.png"], category: "skirt", color: "Black", size: "M", discount: 8 },
  { id: 7, name: "Tank Top", price: 1499, images: ["/images/black-tank-top.png"], category: "top", color: "Black", size: "S", discount: 15 },
  { id: 8, name: "Blue Cargo", price: 3499, images: ["/images/blue-cargo.png"], category: "jeans", color: "Blue", size: "32", discount: 25 },
  { id: 9, name: "Denim Jumpsuit", price: 3999, images: ["/images/denim-jumpsuit.png"], category: "jeans", color: "Blue", size: "M", discount: 18 },
  { id: 10, name: "Kurti", price: 1499, images: ["/images/green-kurti.png"], category: "kurti", color: "Green", size: "M", discount: 10 },
  { id: 11, name: "Red Dress", price: 2599, images: ["/images/red-dress.png"], category: "dress", color: "Red", size: "L", discount: 15 },
  { id: 12, name: "Kurti", price: 1299, images: ["/images/pink-kurti.png"], category: "kurti", color: "Pink", size: "S", discount: 10 },
  { id: 13, name: "Red kurti", price: 1499, images: ["/images/red-kurti.png"], category: "kurti", color: "Red", size: "XL", discount: 12 },
  { id: 14, name: "Red top", price: 1099, images: ["/images/red-top.png"], category: "top", color: "Red", size: "M", discount: 5 },
  { id: 15, name: "skirt", price: 1699, images: ["/images/skirt.png"], category: "skirt", color: "Blue", size: "M", discount: 10 },
  { id: 16, name: "White skirt", price: 999, images: ["/images/white-skirt.png"], category: "skirt", color: "White", size: "S", discount: 15 },
  { id: 17, name: "Yellow string dress", price: 1499, images: ["/images/yell-dress.png"], category: "dress", color: "Yellow", size: "S", discount: 20 },
  { id: 18, name: "Yellow Kurti", price: 1499, images: ["/images/yellow-kurti.png"], category: "kurti", color: "Yellow", size: "L", discount: 10 }
];

export const AppContextProvider = ({ children }) => {
  // 1. Toast State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // 2. Auth States
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Track all users for registration
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem("registeredUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const registerUser = (name, email, password) => {
    if (registeredUsers.some((u) => u.email === email) || email === "admin@gmail.com") {
      showToast("Email is already registered!", "error");
      return false;
    }
    const newUser = { id: Date.now(), name, email, password };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem("registeredUsers", JSON.stringify(updated));
    showToast("Registration successful! You can now log in.", "success");
    return true;
  };

  const loginUser = (email, password) => {
    // Check Admin hardcoded
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminSession = { email, name: "Administrator", role: "admin" };
      setUser(adminSession);
      localStorage.setItem("currentUser", JSON.stringify(adminSession));
      showToast("Admin logged in successfully!", "success");
      return { success: true, role: "admin" };
    }

    // Check normal users
    const matched = registeredUsers.find((u) => u.email === email && u.password === password);
    if (matched) {
      const userSession = { email, name: matched.name, role: "user" };
      setUser(userSession);
      localStorage.setItem("currentUser", JSON.stringify(userSession));
      showToast(`Welcome back, ${matched.name}!`, "success");
      return { success: true, role: "user" };
    }

    showToast("Invalid email or password!", "error");
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    showToast("Logged out successfully!", "info");
  };

  // 3. Products State
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("shopProducts");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    } else {
      localStorage.setItem("shopProducts", JSON.stringify(initialProducts));
      return initialProducts;
    }
  });

  const addProduct = (newProd) => {
    if (products.some((p) => String(p.id) === String(newProd.id))) {
      showToast("Product ID already exists!", "error");
      return false;
    }
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem("shopProducts", JSON.stringify(updated));
    showToast("Product added successfully!", "success");
    return true;
  };

  const updateProduct = (id, updatedProd) => {
    const updated = products.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedProd } : p));
    setProducts(updated);
    localStorage.setItem("shopProducts", JSON.stringify(updated));
    showToast("Product updated successfully!", "success");
    return true;
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => String(p.id) !== String(id));
    setProducts(updated);
    localStorage.setItem("shopProducts", JSON.stringify(updated));
    showToast("Product deleted successfully!", "info");
    return true;
  };

  // 4. Cart and Wishlist
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("shopCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("shopWishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const addToCart = (product, size, color) => {
    const cartItem = {
      ...product,
      cartId: Date.now() + Math.random().toString(36).substring(2, 9),
      size: size || "M",
      color: color || (product.images && typeof product.images === "object" ? Object.keys(product.images)[0] : product.color || "Default")
    };
    const updated = [...cart, cartItem];
    setCart(updated);
    localStorage.setItem("shopCart", JSON.stringify(updated));
    showToast(`Added ${product.name} to Cart!`, "success");
  };

  const removeFromCart = (cartId) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    setCart(updated);
    localStorage.setItem("shopCart", JSON.stringify(updated));
    showToast("Removed item from Cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("shopCart");
  };

  const addToWishlist = (product, size, color) => {
    const alreadyIn = wishlist.some((item) => String(item.id) === String(product.id));
    if (alreadyIn) {
      showToast(`${product.name} is already in Wishlist!`, "info");
      return;
    }
    const wishlistItem = {
      ...product,
      size: size || "M",
      color: color || (product.images && typeof product.images === "object" ? Object.keys(product.images)[0] : product.color || "Default")
    };
    const updated = [...wishlist, wishlistItem];
    setWishlist(updated);
    localStorage.setItem("shopWishlist", JSON.stringify(updated));
    showToast(`Added ${product.name} to Wishlist!`, "success");
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => String(item.id) !== String(id));
    setWishlist(updated);
    localStorage.setItem("shopWishlist", JSON.stringify(updated));
    showToast("Removed item from Wishlist.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        toasts,
        showToast,
        user,
        registerUser,
        loginUser,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
