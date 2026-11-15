import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Laptop,
  HardDrive,
  MemoryStick,
  Mouse,
  Keyboard,
  Printer,
  Camera,
  BatteryCharging,
  ShoppingBag,
  ArrowRight,
  X,
  CheckCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";

// ======================================
// API CONFIGURATION
// ======================================

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_URL || "/api";

const WHATSAPP_NUMBER = "919448146841";
const TOKEN_KEY = "customerToken";

// ======================================
// CATEGORY ICONS
// ======================================

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "laptop":
      return Laptop;
    case "ram":
      return MemoryStick;
    case "ssd":
    case "hard disk":
      return HardDrive;
    case "mouse":
      return Mouse;
    case "keyboard":
      return Keyboard;
    case "printer":
      return Printer;
    case "cctv":
      return Camera;
    case "ups":
      return BatteryCharging;
    default:
      return ShoppingBag;
  }
};

// ======================================
// IMAGE URL HELPER
// ======================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${window.location.origin}/${image.replace(/^\/+/, "")}`;
};

// ======================================
// LOAD RAZORPAY CHECKOUT
// ======================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// ======================================
// PRODUCT IMAGE COMPONENT
// ======================================

function ProductImage({ product }) {
  const Icon = getCategoryIcon(product.category);
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(product.image);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-50">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Icon size={40} />
        </div>
      )}

      <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow">
        {product.category || "General"}
      </div>
    </div>
  );
}

// ======================================
// MAIN PRODUCT COMPONENT
// ======================================

export default function Product() {
  // ======================================
  // PRODUCTS
  // ======================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // SELECTED PRODUCT
  // ======================================

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pendingProduct, setPendingProduct] = useState(null);

  // ======================================
  // AUTHENTICATION
  // ======================================

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // ======================================
  // CUSTOMER DETAILS
  // ======================================

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // ======================================
  // PAYMENT
  // ======================================

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ======================================
  // ORDER STATUS
  // ======================================

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState("");

  // ======================================
  // FETCH PRODUCTS
  // ======================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error(`Product API error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data received.");
        }

        setProducts(data);
      } catch (err) {
        console.error("Product fetching error:", err);
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ======================================
  // WHATSAPP ENQUIRY
  // ======================================

  const enquire = (productName) => {
    const message = `Hello Global Systems, I am interested in ${productName}. Please share the current availability and price.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ======================================
  // AUTHENTICATION HEADERS
  // ======================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ======================================
  // BUY NOW - CHECK LOGIN
  // ======================================

  const handleBuyNow = async (product) => {
    const token = localStorage.getItem(TOKEN_KEY);

    // No login token: ask customer to log in.
    if (!token) {
      setPendingProduct(product);
      setAuthMode("login");
      setAuthError("");
      setAuthModalOpen(true);
      return;
    }

    // Verify existing login with backend.
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Session expired");
      }

      const result = await response.json();

      const user = result.user || result.customer || result;

      if (user.name) {
        setCustomerName(user.name);
      }

      setSelectedProduct(product);
    } catch (err) {
      console.error("Authentication check failed:", err);

      localStorage.removeItem(TOKEN_KEY);

      setPendingProduct(product);
      setAuthMode("login");
      setAuthError("Your session has expired. Please log in again.");
      setAuthModalOpen(true);
    }
  };

  // ======================================
  // LOGIN / SIGNUP
  // ======================================

  const handleAuthentication = async (e) => {
    e.preventDefault();

    if (authLoading) return;

    try {
      setAuthLoading(true);
      setAuthError("");

      const endpoint =
        authMode === "login"
          ? `${API_URL}/auth/login`
          : `${API_URL}/auth/signup`;

      const requestBody =
        authMode === "login"
          ? {
              email: authEmail.trim(),
              password: authPassword,
            }
          : {
              name: authName.trim(),
              email: authEmail.trim(),
              password: authPassword,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.token) {
        throw new Error(
          result.message ||
            (authMode === "login"
              ? "Invalid email or password."
              : "Unable to create account.")
        );
      }

      // Save login token.
      localStorage.setItem(TOKEN_KEY, result.token);

      // Fill customer name automatically.
      const loggedInName =
        result.user?.name || authName || "";

      if (loggedInName) {
        setCustomerName(loggedInName);
      }

      // Close authentication popup.
      setAuthModalOpen(false);

      setAuthPassword("");
      setAuthError("");

      // Open checkout for the product they selected.
      if (pendingProduct) {
        setSelectedProduct(pendingProduct);
        setPendingProduct(null);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ======================================
  // RESET CHECKOUT
  // ======================================

  const resetCheckout = () => {
    setSelectedProduct(null);

    setCustomerName("");
    setPhone("");
    setAddress("");
    setPincode("");

    setPaymentMethod("COD");

    setOrderSuccess(false);
    setOrderSaved(false);
    setSubmitting(false);

    setSavedOrderId("");
  };

  // ======================================
  // SAVE COD ORDER TO DATABASE
  // ======================================

  const saveOrderToDB = async () => {
    if (!selectedProduct) {
      throw new Error("No product selected.");
    }

    const productPrice = Number(
      selectedProduct.price ?? selectedProduct.basePrice
    );

    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      throw new Error("Invalid product price.");
    }

    const orderData = {
      customer: {
        name: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
      },

      items: [
        {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          price: productPrice,
          quantity: 1,
        },
      ],

      paymentMethod: "COD",
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Failed to save order.");
    }

    const orderId = result.orderId;

    setSavedOrderId(orderId);
    setOrderSaved(true);

    const message = `
NEW ORDER - GLOBAL SYSTEMS

Order ID: ${orderId}

Product: ${selectedProduct.name}

Price: ₹${productPrice}

Payment Method: COD

Payment Status: Pending

CUSTOMER DETAILS

Name: ${customerName}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}
`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );

    return result;
  };

  // ======================================
  // RAZORPAY PAYMENT
  // ======================================

  const handleRazorpayPayment = async () => {
    if (!selectedProduct) {
      throw new Error("No product selected.");
    }

    const loaded = await loadRazorpayScript();

    if (!loaded) {
      throw new Error("Unable to load Razorpay. Check your internet.");
    }

    // Create Razorpay order on backend.
    const response = await fetch(`${API_URL}/payments/create-order`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        customer: {
          name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          pincode: pincode.trim(),
        },

        items: [
          {
            productId: selectedProduct._id,
            quantity: 1,
          },
        ],
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to create payment.");
    }

    // Razorpay checkout options.
    const options = {
      key: result.key,
      amount: result.amount,
      currency: result.currency,
      name: "Global Systems",
      description: selectedProduct.name,
      order_id: result.razorpayOrderId,

      prefill: {
        name: customerName,
        contact: phone,
      },

      theme: {
        color: "#2563eb",
      },

      handler: async function (paymentResponse) {
        try {
          // Verify payment on backend.
          const verifyResponse = await fetch(
            `${API_URL}/payments/verify`,
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(paymentResponse),
            }
          );

          const verification = await verifyResponse
            .json()
            .catch(() => ({}));

          if (!verifyResponse.ok || !verification.success) {
            throw new Error(
              verification.message || "Payment verification failed."
            );
          }

          setSavedOrderId(verification.orderId);
          setOrderSaved(true);
          setOrderSuccess(true);

          const message = `
NEW PAID ORDER - GLOBAL SYSTEMS

Order ID: ${verification.orderId}

Product: ${selectedProduct.name}

Amount: ₹${result.amount / 100}

Payment: Razorpay

Payment Status: Paid

Customer: ${customerName}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}
`;

          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener,noreferrer"
          );
        } catch (err) {
          console.error("Payment verification error:", err);
          alert(err.message || "Payment verification failed.");
        }
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      alert(
        response.error?.description ||
          "Payment failed. Please try again."
      );
    });

    razorpay.open();
  };

  // ======================================
  // PLACE ORDER
  // ======================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedProduct || submitting) return;

    try {
      setSubmitting(true);

      if (paymentMethod === "RAZORPAY") {
        await handleRazorpayPayment();
      } else {
        await saveOrderToDB();
        setOrderSuccess(true);
      }
    } catch (err) {
      console.error("Order error:", err);

      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <main className="overflow-hidden bg-white">

      {/* ======================================
          HERO SECTION
      ====================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6 pb-20 pt-36">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-bold text-purple-600 shadow-sm">
              <ShoppingBag size={16} />
              Products & Solutions
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
              Quality products.
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Honest technology solutions.
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          PRODUCTS SECTION
      ====================================== */}

      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Featured Products
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
              Explore our products
            </h2>
          </div>

          {loading && (
            <div className="py-20 text-center font-medium text-slate-600">
              Loading products from database...
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 py-12 text-center text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="py-20 text-center text-slate-600">
              No products available.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-2xl"
                >
                  <div>
                    <ProductImage product={product} />

                    <div className="p-7">
                      <h3 className="text-xl font-black text-slate-900">
                        {product.name}
                      </h3>

                      <p className="mt-3 min-h-[56px] leading-7 text-slate-500">
                        {product.description}
                      </p>

                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black text-blue-600">
                          ₹
                          {Number(
                            product.basePrice ?? product.price ?? 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCT BUTTONS */}

                  <div className="flex gap-3 p-7 pt-0">
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.inStock === false}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {product.inStock === false
                        ? "Out of Stock"
                        : "Buy Now"}

                      {product.inStock !== false && (
                        <ArrowRight size={17} />
                      )}
                    </button>

                    <button
                      onClick={() => enquire(product.name)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      Enquire
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================
          LOGIN / SIGNUP MODAL
      ====================================== */}

      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            >

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setAuthModalOpen(false);
                  setPendingProduct(null);
                  setAuthError("");
                }}
                className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>

              {/* ICON */}

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Lock size={30} />
              </div>

              {/* HEADING */}

              <div className="mt-5 text-center">
                <h2 className="text-2xl font-black text-slate-900">
                  {authMode === "login"
                    ? "Welcome Back!"
                    : "Create Your Account"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {authMode === "login"
                    ? "Please log in to continue with your purchase."
                    : "Create an account to shop at Global Systems."}
                </p>
              </div>

              {/* AUTH FORM */}

              <form
                onSubmit={handleAuthentication}
                className="mt-7 space-y-4"
              >

                {/* NAME - SIGNUP ONLY */}

                {authMode === "signup" && (
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* EMAIL */}

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      required
                      minLength={6}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* ERROR MESSAGE */}

                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                    {authError}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-full bg-blue-600 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {authLoading
                    ? "Please wait..."
                    : authMode === "login"
                    ? "Login & Continue"
                    : "Create Account"}
                </button>
              </form>

              {/* SWITCH LOGIN / SIGNUP */}

              <div className="mt-6 text-center text-sm text-slate-500">
                {authMode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(
                      authMode === "login" ? "signup" : "login"
                    );
                    setAuthError("");
                  }}
                  className="ml-2 font-bold text-blue-600 hover:text-blue-800"
                >
                  {authMode === "login" ? "Sign Up" : "Login"}
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                Secure customer authentication · Global Systems
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================
          CHECKOUT MODAL
      ====================================== */}

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >

              {/* CLOSE BUTTON */}

              <button
                onClick={resetCheckout}
                disabled={submitting}
                className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>

              {/* ORDER SUCCESS */}

              {orderSuccess ? (
                <div className="py-12 text-center">
                  <CheckCircle className="mx-auto h-16 w-16 animate-bounce text-green-500" />

                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    Order Placed Successfully!
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Your order has been saved.
                  </p>

                  <p className="mt-3 text-sm font-bold text-blue-600">
                    Order ID: {savedOrderId}
                  </p>

                  <button
                    onClick={resetCheckout}
                    className="mt-6 rounded-full bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (

                /* CHECKOUT FORM */

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Complete Your Order
                  </h3>

                  {/* SELECTED PRODUCT */}

                  <div className="mt-4 flex items-center justify-between rounded-2xl border bg-slate-50 p-4">
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {selectedProduct.name}
                      </h4>

                      <p className="mt-1 font-bold text-blue-600">
                        ₹
                        {Number(
                          selectedProduct.basePrice ??
                            selectedProduct.price
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER FORM */}

                  <form
                    onSubmit={handlePlaceOrder}
                    className="mt-6 space-y-4"
                  >

                    {/* NAME */}

                    <div>
                      <label className="block text-sm font-bold text-slate-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="block text-sm font-bold text-slate-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* ADDRESS */}

                    <div>
                      <label className="block text-sm font-bold text-slate-700">
                        Delivery Address
                      </label>

                      <textarea
                        required
                        rows="2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, City"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* PINCODE */}

                    <div>
                      <label className="block text-sm font-bold text-slate-700">
                        Pincode
                      </label>

                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter 6-digit pincode"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* PAYMENT METHOD */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Select Payment Method
                      </label>

                      <div className="grid grid-cols-2 gap-4">

                        {/* COD */}

                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-medium ${
                            paymentMethod === "COD"
                              ? "border-blue-600 bg-blue-50/50 text-blue-900"
                              : "border-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                          />

                          Cash on Delivery
                        </label>

                        {/* RAZORPAY */}

                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-medium ${
                            paymentMethod === "RAZORPAY"
                              ? "border-blue-600 bg-blue-50/50 text-blue-900"
                              : "border-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="RAZORPAY"
                            checked={paymentMethod === "RAZORPAY"}
                            onChange={() =>
                              setPaymentMethod("RAZORPAY")
                            }
                          />

                          Razorpay (UPI / Cards)
                        </label>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 w-full rounded-full bg-slate-900 py-4 font-bold text-white shadow-xl transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Processing..."
                        : paymentMethod === "RAZORPAY"
                        ? `Pay ₹${Number(
                            selectedProduct.basePrice ??
                              selectedProduct.price
                          ).toLocaleString("en-IN")} with Razorpay`
                        : "Confirm COD Order"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}