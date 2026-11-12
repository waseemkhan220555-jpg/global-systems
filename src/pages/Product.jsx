
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
  Smartphone,
  QrCode,
} from "lucide-react";

// ======================================
// API CONFIGURATION
// ======================================

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const UPI_ID = "9483284457@axl";
const UPI_NAME = "Global Systems";
const WHATSAPP_NUMBER = "919448146841";

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

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${window.location.origin}/${image.replace(/^\/+/, "")}`;
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
  // PRODUCTS

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SELECTED PRODUCT

  const [selectedProduct, setSelectedProduct] = useState(null);

  // CUSTOMER DETAILS

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // PAYMENT

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ORDER STATUS

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  // UPI DETAILS

  const [upiPaymentUrl, setUpiPaymentUrl] = useState("");
  const [upiQrUrl, setUpiQrUrl] = useState("");
  const [savedOrderId, setSavedOrderId] = useState("");

  // ======================================
  // FETCH PRODUCTS FROM MONGODB
  // ======================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
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

    setUpiPaymentUrl("");
    setUpiQrUrl("");
    setSavedOrderId("");
  };

  // ======================================
  // SAVE ORDER TO DATABASE
  // ======================================

  const saveOrderToDB = async (
    paymentStatus,
    transactionId = ""
  ) => {
    if (!selectedProduct) {
      throw new Error("No product selected");
    }

    const orderId = `ORD-${Date.now()}`;

    const productPrice = Number(selectedProduct.basePrice);

    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      throw new Error("Invalid product base price");
    }

    // IMPORTANT:
    // Backend enum accepts COD, UPI_QR, RAZORPAY.
    // Therefore convert frontend UPI to UPI_QR.

    const orderPaymentMethod =
      paymentMethod === "UPI" ? "UPI_QR" : "COD";

    const orderData = {
      orderId,

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

      totalAmount: productPrice,

      paymentMethod: orderPaymentMethod,

      paymentStatus,

      ...(transactionId && {
        paymentTxnId: transactionId,
      }),
    };

    console.log("Sending order:", orderData);

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(orderData),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      console.error(
        "ORDER ERROR DETAILS:",
        JSON.stringify(result, null, 2)
      );

      throw new Error(
        result.error ||
        result.message ||
        "Failed to save order"
      );
    }

    setSavedOrderId(orderId);
    setOrderSaved(true);

    // ======================================
    // WHATSAPP ORDER NOTIFICATION
    // ======================================

    const message = `
🛍️ NEW ORDER - GLOBAL SYSTEMS

Order ID: ${orderId}

Product: ${selectedProduct.name}

Base Price: ₹${productPrice}

Payment Method: ${orderPaymentMethod}

Payment Status: ${paymentStatus}

CUSTOMER DETAILS

Name: ${customerName}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}
`;

    // Open WhatsApp automatically only for COD orders
if (orderPaymentMethod === "COD") {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

    return result;
  };

  // ======================================
  // UPI PAYMENT
  // ======================================

  const handleUPIPayment = async () => {
    if (!UPI_ID) {
      throw new Error("Shop owner's UPI ID is missing");
    }

    if (!selectedProduct) {
      throw new Error("Please select a product");
    }

    const productPrice = Number(selectedProduct.basePrice);

    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      throw new Error("Invalid product price");
    }

    // UNIQUE TRANSACTION REFERENCE

    const transactionReference = `GS${Date.now()}`;

    // UPI PAYMENT URL

    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_NAME,
      am: productPrice.toFixed(2),
      cu: "INR",
      tn: `Order ${transactionReference}`,
      tr: transactionReference,
    });

    const upiUrl = `upi://pay?${params.toString()}`;

    // QR CODE URL

    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

    // SAVE ORDER AS PENDING

    await saveOrderToDB("Pending", transactionReference);

    setUpiPaymentUrl(upiUrl);
    setUpiQrUrl(qrUrl);
  };

  // ======================================
  // PLACE ORDER
  // ======================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedProduct || submitting) return;

    try {
      setSubmitting(true);

      if (paymentMethod === "UPI") {
        await handleUPIPayment();
      } else {
        await saveOrderToDB("Pending");

        setOrderSuccess(true);

        setTimeout(() => {
          resetCheckout();
        }, 3000);
      }
    } catch (err) {
      console.error("Order error:", err);

      alert(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================
  // OPEN UPI APP
  // ======================================

  const openUPIApp = () => {
    if (!upiPaymentUrl) return;

    window.location.href = upiPaymentUrl;
  };

  // ======================================
  // UI
  // ======================================

  return (
    <main className="overflow-hidden bg-white">

      {/* HERO SECTION */}

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

      {/* PRODUCTS SECTION */}

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
                          ₹{Number(product.basePrice || 0).toLocaleString("en-IN")}
                        </p>

                      </div>
                    </div>
                  </div>

                  {/* PRODUCT BUTTONS */}

                  <div className="flex gap-3 p-7 pt-0">

                    <button
                      onClick={() => setSelectedProduct(product)}
                      disabled={!product.inStock}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {product.inStock ? "Buy Now" : "Out of Stock"}

                      {product.inStock && <ArrowRight size={17} />}
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

      {/* CHECKOUT MODAL */}

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

              {/* COD SUCCESS */}

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

                </div>

              ) : upiPaymentUrl ? (

                /* UPI PAYMENT SCREEN */

                <div className="py-4 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <QrCode size={36} />
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-slate-900">
                    Complete UPI Payment
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Scan this QR code using PhonePe, Google Pay or another UPI app.
                  </p>

                  <div className="mt-5 rounded-2xl border bg-slate-50 p-4">

                    <p className="text-sm font-bold text-slate-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-3xl font-black text-blue-600">
                      ₹{Number(selectedProduct.basePrice).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Pay to: {UPI_NAME}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {UPI_ID}
                    </p>

                  </div>

                  {/* QR CODE */}

                  <div className="mx-auto mt-5 flex w-fit items-center justify-center rounded-2xl border bg-white p-3 shadow-sm">

                    <img
                      src={upiQrUrl}
                      alt="UPI Payment QR Code"
                      className="h-56 w-56"
                    />

                  </div>

                  {/* OPEN UPI APP */}

                  <button
                    type="button"
                    onClick={openUPIApp}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700"
                  >
                    <Smartphone size={20} />
                    Open UPI Payment App
                  </button>

                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">

                    <p className="font-bold text-amber-800">
                      Payment confirmation
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-700">
                      Your order is saved as Pending. After paying, the shop owner must confirm receipt before the order is marked as Paid.
                    </p>

                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Order ID: {savedOrderId}
                  </p>

                  <button
                    type="button"
                    onClick={resetCheckout}
                    className="mt-4 w-full rounded-full border border-slate-300 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Close
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
                        ₹{Number(selectedProduct.basePrice).toLocaleString("en-IN")}
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

                        {/* UPI */}

                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-medium ${
                            paymentMethod === "UPI"
                              ? "border-blue-600 bg-blue-50/50 text-blue-900"
                              : "border-slate-200"
                          }`}
                        >

                          <input
                            type="radio"
                            name="payment"
                            value="UPI"
                            checked={paymentMethod === "UPI"}
                            onChange={() => setPaymentMethod("UPI")}
                          />

                          Online UPI

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
                        : paymentMethod === "UPI"
                        ? `Pay ₹${Number(selectedProduct.basePrice).toLocaleString("en-IN")} & Continue`
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
