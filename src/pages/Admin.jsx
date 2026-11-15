import { useEffect, useState } from "react";

import {
  Clock,
  Phone,
  User,
  Wrench,
  RefreshCw,
  LogOut,
  Lock,
  AlertCircle,
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  MessageSquare,
  Save,
} from "lucide-react";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_URL || "/api";

function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const emptyProduct = {
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    description: "",
    image: "",
    stockQuantity: 10,
    inStock: true,
  };

  const [productForm, setProductForm] = useState(emptyProduct);

  // ======================================
  // API REQUEST
  // ======================================

  const adminRequest = async (endpoint, options = {}, key = adminKey) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      sessionStorage.removeItem("gs_admin_key");
      setAuthenticated(false);
      setAdminKey("");
      throw new Error("Admin session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  };

  // ======================================
  // VERIFY ADMIN
  // ======================================

  const verifyAdmin = async (key) => {
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        headers: {
          "x-admin-key": key,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message:
            response.status === 401 || response.status === 403
              ? "Incorrect admin password."
              : "Server error. Please try again.",
        };
      }

      const data = await response.json();

      return {
        success: Array.isArray(data),
        inquiries: Array.isArray(data) ? data : [],
        message: "Unexpected server response.",
      };
    } catch {
      return {
        success: false,
        message: "Cannot connect to backend. Check your server.",
      };
    }
  };

  // ======================================
  // FETCH DASHBOARD DATA
  // ======================================

  const fetchDashboardData = async (key = adminKey) => {
    const [productData, inquiryData] = await Promise.all([
      adminRequest("/products", {}, key),
      adminRequest("/inquiries", {}, key),
    ]);

    setProducts(
      Array.isArray(productData) ? productData : productData.products || []
    );

    setInquiries(
      Array.isArray(inquiryData) ? inquiryData : inquiryData.inquiries || []
    );
  };

  // ======================================
  // CHECK EXISTING SESSION
  // ======================================

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const savedKey = sessionStorage.getItem("gs_admin_key");

      if (!savedKey) {
        setCheckingSession(false);
        return;
      }

      const result = await verifyAdmin(savedKey);

      if (!active) return;

      if (result.success) {
        setAdminKey(savedKey);
        setAuthenticated(true);

        try {
          await fetchDashboardData(savedKey);
        } catch (err) {
          if (active) setError(err.message);
        }
      } else {
        sessionStorage.removeItem("gs_admin_key");
        setError(result.message);
      }

      if (active) setCheckingSession(false);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  // ======================================
  // LOGIN
  // ======================================

  const handleLogin = async (e) => {
    e.preventDefault();

    const enteredKey = keyInput.trim();

    if (!enteredKey) {
      setError("Please enter your admin password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await verifyAdmin(enteredKey);

    if (result.success) {
      sessionStorage.setItem("gs_admin_key", enteredKey);

      setAdminKey(enteredKey);
      setAuthenticated(true);
      setKeyInput("");

      try {
        await fetchDashboardData(enteredKey);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // ======================================
  // REFRESH
  // ======================================

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await fetchDashboardData();
      setSuccess("Dashboard refreshed successfully.");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    sessionStorage.removeItem("gs_admin_key");

    setAdminKey("");
    setKeyInput("");
    setProducts([]);
    setInquiries([]);
    setAuthenticated(false);
    setError("");
    setSuccess("");
  };

  // ======================================
  // OPEN ADD PRODUCT FORM
  // ======================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductForm(true);
    setError("");
    setSuccess("");
  };

  // ======================================
  // OPEN EDIT PRODUCT FORM
  // ======================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      basePrice: product.basePrice ?? "",
      description: product.description || "",
      image: product.image || "",
      stockQuantity: product.stockQuantity ?? 0,
      inStock: product.inStock ?? true,
    });

    setShowProductForm(true);
    setError("");
    setSuccess("");
  };

  // ======================================
  // FORM INPUT CHANGE
  // ======================================

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================
  // SAVE PRODUCT
  // ======================================

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const productData = {
        ...productForm,
        basePrice: Number(productForm.basePrice),
        stockQuantity: Number(productForm.stockQuantity),
      };

      if (
        !productData.name.trim() ||
        !productData.category.trim() ||
        productData.basePrice <= 0 ||
        !Number.isFinite(productData.basePrice) ||
        !Number.isFinite(productData.stockQuantity) ||
        productData.stockQuantity < 0
      ) {
        throw new Error("Please enter valid product details.");
      }

      const isEditing = Boolean(editingProduct);

      const endpoint = isEditing
        ? `/products/${editingProduct._id}`
        : "/products";

      await adminRequest(
        endpoint,
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(productData),
        }
      );

      await fetchDashboardData();

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(emptyProduct);

      setSuccess(
        isEditing
          ? "Product updated successfully!"
          : "New product added successfully!"
      );
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ======================================
  // DELETE PRODUCT
  // ======================================

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await adminRequest(`/products/${id}`, {
        method: "DELETE",
      });

      await fetchDashboardData();

      setSuccess("Product deleted successfully!");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ======================================
  // FORMAT DATE
  // ======================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ======================================
  // LOADING SCREEN
  // ======================================

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // ======================================
  // LOGIN SCREEN
  // ======================================

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Lock size={30} className="text-blue-600" />
          </div>

          <h1 className="text-center text-3xl font-black text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-center text-slate-500">
            Global Systems Management Panel
          </p>

          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
            className="mt-7 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  // ======================================
  // MAIN DASHBOARD
  // ======================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="sticky top-0 z-20 border-b bg-white px-5 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-blue-700">
              GLOBAL SYSTEMS
            </h1>
            <p className="text-xs text-slate-500">
              Administration Panel
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">

        {/* SIDEBAR */}

        <aside className="h-fit w-full rounded-2xl border bg-white p-4 shadow-sm md:w-64">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          {[
            {
              id: "overview",
              label: "Overview",
              icon: LayoutDashboard,
            },
            {
              id: "products",
              label: "Products",
              icon: Package,
            },
            {
              id: "inquiries",
              label: "Inquiries",
              icon: MessageSquare,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setError("");
                  setSuccess("");
                }}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}

        <main className="min-w-0 flex-1">

          {/* NOTIFICATIONS */}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle size={19} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl bg-green-50 p-4 font-semibold text-green-700">
              {success}
            </div>
          )}

          {/* OVERVIEW */}

          {activeTab === "overview" && (
            <section>
              <h2 className="text-3xl font-black text-slate-900">
                Dashboard Overview
              </h2>

              <p className="mt-1 text-slate-500">
                Welcome to Global Systems Administration.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <Package className="text-blue-600" size={28} />

                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    Total Products
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-blue-600">
                    {products.length}
                  </h3>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <MessageSquare className="text-purple-600" size={28} />

                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    Total Inquiries
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-purple-600">
                    {inquiries.length}
                  </h3>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <Package className="text-green-600" size={28} />

                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    Available Products
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-green-600">
                    {products.filter((p) => p.inStock).length}
                  </h3>
                </div>
              </div>
            </section>
          )}

          {/* PRODUCTS */}

          {activeTab === "products" && (
            <section>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">
                    Product Management
                  </h2>

                  <p className="mt-1 text-slate-500">
                    Add, edit and manage your products.
                  </p>
                </div>

                <button
                  onClick={handleAddProduct}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>

              {products.length === 0 ? (
                <div className="mt-6 rounded-2xl border bg-white p-10 text-center shadow-sm">
                  <Package
                    size={42}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <h3 className="font-bold text-slate-700">
                    No products found.
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Click Add Product to create your first product.
                  </p>
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border bg-white shadow-sm">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-slate-100 text-sm text-slate-600">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="border-t hover:bg-slate-50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg border object-contain"
                                />
                              ) : (
                                <Package className="text-slate-400" />
                              )}

                              <div>
                                <p className="font-bold text-slate-900">
                                  {product.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {product.brand}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-sm">
                            {product.category}
                          </td>

                          <td className="p-4 font-bold text-blue-600">
                            ₹{Number(product.basePrice).toLocaleString("en-IN")}
                          </td>

                          <td className="p-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                product.inStock
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>

                            <p className="mt-1 text-xs text-slate-500">
                              Quantity: {product.stockQuantity ?? 0}
                            </p>
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                title="Edit Product"
                                className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteProduct(product._id)
                                }
                                title="Delete Product"
                                className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* INQUIRIES */}

          {activeTab === "inquiries" && (
            <section>
              <h2 className="text-3xl font-black text-slate-900">
                Service Inquiries
              </h2>

              <p className="mt-1 text-slate-500">
                Customer requests submitted through your website.
              </p>

              {inquiries.length === 0 ? (
                <div className="mt-6 rounded-2xl border bg-white p-10 text-center shadow-sm">
                  <Wrench
                    size={40}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <h3 className="font-bold text-slate-700">
                    No inquiries received yet.
                  </h3>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {[...inquiries].reverse().map((item) => (
                    <div
                      key={item._id || item.id}
                      className="rounded-2xl border bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 border-b pb-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {item.service || "General Inquiry"}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={13} />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        <p className="flex items-center gap-2 font-bold">
                          <User size={17} />
                          {item.name}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={17} />

                          <a
                            href={`tel:${item.phone}`}
                            className="text-blue-600"
                          >
                            {item.phone}
                          </a>
                        </p>
                      </div>

                      {item.message && (
                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                          <p className="mb-2 text-xs font-bold uppercase text-slate-500">
                            Issue Details
                          </p>

                          <p className="whitespace-pre-wrap text-sm text-slate-700">
                            {item.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}

      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your product information below.
                </p>
              </div>

              <button
                onClick={() => setShowProductForm(false)}
                className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={productForm.name}
                    onChange={handleProductChange}
                    placeholder="Enter product name"
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductChange}
                    placeholder="Enter brand"
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category *
                  </label>

                  <input
                    name="category"
                    value={productForm.category}
                    onChange={handleProductChange}
                    placeholder="Laptop, Accessories, CCTV..."
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    name="basePrice"
                    value={productForm.basePrice}
                    onChange={handleProductChange}
                    placeholder="Enter price"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stockQuantity"
                    value={productForm.stockQuantity}
                    onChange={handleProductChange}
                    min="0"
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Image URL
                  </label>

                  <input
                    name="image"
                    value={productForm.image}
                    onChange={handleProductChange}
                    placeholder="Paste image URL"
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                    placeholder="Describe your product..."
                    rows="4"
                    className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={productForm.inStock}
                      onChange={handleProductChange}
                      className="h-5 w-5 accent-blue-600"
                    />

                    <span className="font-semibold text-slate-700">
                      Product is available for purchase
                    </span>
                  </label>
                </div>

              </div>

              {productForm.image && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold">
                    Image Preview
                  </p>

                  <img
                    src={productForm.image}
                    alt="Product preview"
                    className="h-28 w-28 rounded-xl border object-contain"
                  />
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="rounded-xl border px-5 py-3 font-bold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={18} />

                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;