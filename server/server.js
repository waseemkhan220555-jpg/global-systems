
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

// ======================================
// RAZORPAY CONFIGURATION
// ======================================

let razorpayInstance = null;

function getRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error("Razorpay API keys are missing.");
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
}

// ======================================
// EXPRESS CONFIGURATION
// ======================================

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ======================================
// ADMIN AUTHENTICATION
// ======================================

function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  const receivedKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(500).json({
      success: false,
      message: "Admin key is not configured.",
    });
  }

  if (!receivedKey) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
  }

  const expected = Buffer.from(adminKey);
  const received = Buffer.from(String(receivedKey));

  if (
    expected.length !== received.length ||
    !crypto.timingSafeEqual(expected, received)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin key.",
    });
  }

  next();
}

// ======================================
// CUSTOMER AUTHENTICATION
// ======================================

function requireCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue.",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.userId || !mongoose.isValidObjectId(decoded.userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid login session.",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired login session.",
    });
  }
}

// ======================================
// INQUIRY MODEL
// ======================================

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  service: String,
  message: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inquiry =
  mongoose.models.Inquiry ||
  mongoose.model("Inquiry", inquirySchema);

// ======================================
// CUSTOMER SIGNUP
// ======================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2 to 60 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (cleanPassword.length < 8 || cleanPassword.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 8 to 72 characters.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      cleanPassword,
      12
    );

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "customer",
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

// ======================================
// CUSTOMER LOGIN
// ======================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful!",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// ======================================
// GET LOGGED-IN CUSTOMER
// ======================================

app.get(
  "/api/auth/me",
  requireCustomer,
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Customer account not found.",
        });
      }

      return res.json({
        success: true,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Customer profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch customer profile.",
      });
    }
  }
);

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Global Systems API is running!",
    payment: "Razorpay + COD",
  });
});

// ======================================
// GET ALL PRODUCTS
// ======================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.json(products);
  } catch (error) {
    console.error("Product fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
});

// ======================================
// GET SINGLE PRODUCT
// ======================================

app.get("/api/products/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Single product error:", error);

    return res.status(500).json({
      message: "Unable to fetch product.",
    });
  }
});

// ======================================
// ADD PRODUCT - ADMIN ONLY
// ======================================

app.post(
  "/api/products",
  requireAdmin,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Product added successfully.",
        product,
      });
    } catch (error) {
      console.error("Add product error:", error);

      return res.status(400).json({
        message: error.message,
      });
    }
  }
);

// ======================================
// UPDATE PRODUCT - ADMIN ONLY
// ======================================

app.put(
  "/api/products/:id",
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid product ID.",
        });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      return res.json({
        success: true,
        message: "Product updated successfully.",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);

      return res.status(400).json({
        message: error.message,
      });
    }
  }
);

// ======================================
// DELETE PRODUCT - ADMIN ONLY
// ======================================

app.delete(
  "/api/products/:id",
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid product ID.",
        });
      }

      const product = await Product.findByIdAndDelete(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      return res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      return res.status(500).json({
        message: "Unable to delete product.",
      });
    }
  }
);

// ======================================
// RAZORPAY - CREATE PAYMENT ORDER
// LOGIN REQUIRED
// ======================================

app.post(
  "/api/payments/create-order",
  requireCustomer,
  async (req, res) => {
    try {
      const { customer, items } = req.body;

      if (
        !customer ||
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.pincode
      ) {
        return res.status(400).json({
          success: false,
          message: "Complete all delivery details.",
        });
      }

      const name = String(customer.name).trim();
      const phone = String(customer.phone).trim();
      const address = String(customer.address).trim();
      const pincode = String(customer.pincode).trim();

      if (!name || !address) {
        return res.status(400).json({
          message: "Enter valid delivery details.",
        });
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          message: "Enter a valid 10-digit phone number.",
        });
      }

      if (!/^[0-9]{6}$/.test(pincode)) {
        return res.status(400).json({
          message: "Enter a valid pincode.",
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Your cart is empty.",
        });
      }

      if (items.length > 50) {
        return res.status(400).json({
          message: "Too many products.",
        });
      }

      const verifiedItems = [];
      let totalAmount = 0;

      for (const item of items) {
        const productId = item.productId || item._id;
        const quantity = Number(
          item.qty || item.quantity || 1
        );

        if (
          !productId ||
          !mongoose.isValidObjectId(productId) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 100
        ) {
          return res.status(400).json({
            message: "Invalid product or quantity.",
          });
        }

        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({
            message: "Product not found.",
          });
        }

        const price = Number(
          product.price ?? product.basePrice
        );

        const stock = Number(product.stockQuantity);

        if (!Number.isFinite(price) || price <= 0) {
          return res.status(400).json({
            message: "Invalid product price.",
          });
        }

        if (
          !Number.isFinite(stock) ||
          stock < quantity
        ) {
          return res.status(400).json({
            message: `${product.name} has insufficient stock.`,
          });
        }

        verifiedItems.push({
          productId: product._id,
          name: product.name,
          variantName: item.variantName || "",
          basePrice: Number(product.basePrice ?? price),
          price,
          qty: quantity,
          quantity,
        });

        totalAmount += price * quantity;
      }

      totalAmount = Number(totalAmount.toFixed(2));

      const amountInPaise = Math.round(
        totalAmount * 100
      );

      if (amountInPaise < 100) {
        return res.status(400).json({
          message: "Minimum payment amount is ₹1.",
        });
      }

      const orderId =
        "ORD-" +
        Date.now() +
        "-" +
        crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();

      const razorpayOrder = await getRazorpay().orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderId,

        notes: {
          store: "Global Systems",
          orderId,
        },
      });

      const order = await Order.create({
        orderId,

        // Link this order to the logged-in customer.
        userId: req.userId,

        customer: {
          name,
          phone,
          address,
          pincode,
          coordinates: customer.coordinates || undefined,
        },

        items: verifiedItems,
        totalAmount,

        paymentMethod: "RAZORPAY",
        paymentStatus: "Pending",
        orderStatus: "Payment Pending",

        razorpayOrderId: razorpayOrder.id,

        statusHistory: [
          {
            status: "Payment Pending",
            note: "Razorpay payment initiated.",
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Payment order created.",
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order.orderId,
      });
    } catch (error) {
      console.error(
        "Razorpay order creation error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to create payment order.",
      });
    }
  }
);

// ======================================
// RAZORPAY - VERIFY PAYMENT
// LOGIN REQUIRED
// ======================================

app.post(
  "/api/payments/verify",
  requireCustomer,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing payment details.",
        });
      }

      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
          success: false,
          message: "Payment configuration error.",
        });
      }

      // Find the order belonging to this customer only.
      const order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
        userId: req.userId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      if (order.paymentStatus === "Paid") {
        return res.json({
          success: true,
          message: "Payment already verified.",
          orderId: order.orderId,
        });
      }

      // Verify Razorpay signature.
      const expectedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

      const signatureBuffer = Buffer.from(
        String(razorpay_signature),
        "hex"
      );

      const expectedBuffer = Buffer.from(
        expectedSignature,
        "hex"
      );

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(
          signatureBuffer,
          expectedBuffer
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature.",
        });
      }

      // Fetch payment directly from Razorpay.
      const payment = await getRazorpay().payments.fetch(
        razorpay_payment_id
      );

      if (
        payment.order_id !== razorpay_order_id ||
        payment.amount !== Math.round(order.totalAmount * 100) ||
        payment.currency !== "INR" ||
        payment.status !== "captured"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment is not captured or details do not match.",
        });
      }

      order.paymentStatus = "Paid";
      order.paymentTxnId = razorpay_payment_id;
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentVerifiedAt = new Date();
      order.orderStatus = "Order Placed";

      order.statusHistory.push({
        status: "Order Placed",
        note: "Razorpay payment verified successfully.",
      });

      await order.save();

      return res.json({
        success: true,
        message: "Payment verified successfully.",
        orderId: order.orderId,
      });
    } catch (error) {
      console.error(
        "Razorpay verification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Payment verification failed.",
      });
    }
  }
);

// ======================================
// COD ORDER CREATION
// LOGIN REQUIRED
// ======================================

app.post(
  "/api/orders",
  requireCustomer,
  async (req, res) => {
    try {
      const { customer, items, paymentMethod } = req.body;

      if (paymentMethod !== "COD") {
        return res.status(400).json({
          success: false,
          message:
            "Online payments must use Razorpay checkout.",
        });
      }

      if (
        !customer ||
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.pincode
      ) {
        return res.status(400).json({
          message: "Complete all customer details.",
        });
      }

      const name = String(customer.name).trim();
      const phone = String(customer.phone).trim();
      const address = String(customer.address).trim();
      const pincode = String(customer.pincode).trim();

      if (!name || !address) {
        return res.status(400).json({
          message: "Enter valid customer details.",
        });
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          message: "Enter a valid 10-digit phone number.",
        });
      }

      if (!/^[0-9]{6}$/.test(pincode)) {
        return res.status(400).json({
          message: "Enter a valid 6-digit pincode.",
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Your cart is empty.",
        });
      }

      if (items.length > 50) {
        return res.status(400).json({
          message: "Too many products.",
        });
      }

      const verifiedItems = [];
      let totalAmount = 0;

      for (const item of items) {
        const productId = item.productId || item._id;

        const quantity = Number(
          item.qty || item.quantity || 1
        );

        if (
          !productId ||
          !mongoose.isValidObjectId(productId) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 100
        ) {
          return res.status(400).json({
            message: "Invalid product or quantity.",
          });
        }

        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({
            message: "Product not found.",
          });
        }

        const price = Number(
          product.price ?? product.basePrice
        );

        const stock = Number(product.stockQuantity);

        if (!Number.isFinite(price) || price <= 0) {
          return res.status(400).json({
            message: "Invalid product price.",
          });
        }

        if (
          !Number.isFinite(stock) ||
          stock < quantity
        ) {
          return res.status(400).json({
            message: `${product.name} has insufficient stock.`,
          });
        }

        verifiedItems.push({
          productId: product._id,
          name: product.name,
          variantName: item.variantName || "",
          basePrice: Number(product.basePrice ?? price),
          price,
          qty: quantity,
          quantity,
        });

        totalAmount += price * quantity;
      }

      totalAmount = Number(totalAmount.toFixed(2));

      const orderId =
        "ORD-" +
        Date.now() +
        "-" +
        crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();

      const order = await Order.create({
        orderId,

        // Link this order to the logged-in customer.
        userId: req.userId,

        customer: {
          name,
          phone,
          address,
          pincode,
          coordinates: customer.coordinates || undefined,
        },

        items: verifiedItems,
        totalAmount,

        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Order Placed",

        trackingUrl: "",

        statusHistory: [
          {
            status: "Order Placed",
            note: "Cash on Delivery order placed.",
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        orderId: order.orderId,
        order,
      });
    } catch (error) {
      console.error("COD order creation error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to place order.",
      });
    }
  }
);

// ======================================
// CUSTOMER ORDER TRACKING
// ORDER ID + PHONE
// ======================================

app.post("/api/orders/track", async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({
        message: "Order ID and phone number are required.",
      });
    }

    const order = await Order.findOne({
      orderId: String(orderId).trim(),
      "customer.phone": String(phone).trim(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Check your details.",
      });
    }

    return res.json({
      success: true,

      order: {
        orderId: order.orderId,
        customerName: order.customer.name,

        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.qty || item.quantity,
          price: item.price,
        })),

        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        placedAt: order.placedAt,
        trackingUrl: order.trackingUrl,
      },
    });
  } catch (error) {
    console.error("Order tracking error:", error);

    return res.status(500).json({
      message: "Unable to track order.",
    });
  }
});

// ======================================
// ADMIN - GET ALL ORDERS
// ======================================

app.get(
  "/api/admin/orders",
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({
        placedAt: -1,
      });

      return res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Admin orders error:", error);

      return res.status(500).json({
        message: "Unable to fetch orders.",
      });
    }
  }
);

// ======================================
// ADMIN - GET SINGLE ORDER
// ======================================

app.get(
  "/api/admin/orders/:orderId",
  requireAdmin,
  async (req, res) => {
    try {
      const order = await Order.findOne({
        orderId: req.params.orderId,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      return res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Single order error:", error);

      return res.status(500).json({
        message: "Unable to fetch order.",
      });
    }
  }
);

// ======================================
// ADMIN - UPDATE ORDER STATUS
// ======================================

app.patch(
  "/api/admin/orders/:orderId/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { orderStatus } = req.body;

      const allowedStatuses = [
        "Order Placed",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(orderStatus)) {
        return res.status(400).json({
          message: "Invalid order status.",
          allowedStatuses,
        });
      }

      const order = await Order.findOne({
        orderId: req.params.orderId,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      if (
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Cancelled"
      ) {
        return res.status(400).json({
          message: "Order is already in a final state.",
        });
      }

      if (
        order.paymentMethod === "RAZORPAY" &&
        order.paymentStatus !== "Paid"
      ) {
        return res.status(400).json({
          message: "Cannot process an unpaid Razorpay order.",
        });
      }

      order.orderStatus = orderStatus;

      order.statusHistory.push({
        status: orderStatus,
        note: "Order status updated by admin.",
      });

      await order.save();

      return res.json({
        success: true,
        message: "Order status updated.",
        order,
      });
    } catch (error) {
      console.error("Order status update error:", error);

      return res.status(500).json({
        message: "Unable to update order status.",
      });
    }
  }
);

// ======================================
// ADMIN - UPDATE PAYMENT STATUS
// ======================================

app.patch(
  "/api/admin/orders/:orderId/payment",
  requireAdmin,
  async (req, res) => {
    try {
      const { paymentStatus, paymentTxnId } = req.body;

      const allowedStatuses = [
        "Pending",
        "Paid",
        "Failed",
      ];

      if (!allowedStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: "Invalid payment status.",
        });
      }

      const order = await Order.findOne({
        orderId: req.params.orderId,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      // Razorpay payments must be verified by Razorpay.
      if (
        order.paymentMethod === "RAZORPAY" &&
        paymentStatus === "Paid" &&
        order.paymentStatus !== "Paid"
      ) {
        return res.status(400).json({
          message:
            "Razorpay payments must be verified through checkout.",
        });
      }

      order.paymentStatus = paymentStatus;

      if (paymentTxnId !== undefined) {
        order.paymentTxnId = String(paymentTxnId).trim();
      }

      await order.save();

      return res.json({
        success: true,
        message: "Payment status updated.",
        order,
      });
    } catch (error) {
      console.error("Payment update error:", error);

      return res.status(500).json({
        message: "Unable to update payment status.",
      });
    }
  }
);

// ======================================
// ADMIN - UPDATE TRACKING URL
// ======================================

app.patch(
  "/api/admin/orders/:orderId/tracking",
  requireAdmin,
  async (req, res) => {
    try {
      const { trackingUrl } = req.body;

      if (
        trackingUrl &&
        !/^https?:\/\/\S+$/i.test(trackingUrl)
      ) {
        return res.status(400).json({
          message: "Invalid tracking URL.",
        });
      }

      const order = await Order.findOne({
        orderId: req.params.orderId,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      order.trackingUrl = trackingUrl || "";

      await order.save();

      return res.json({
        success: true,
        message: "Tracking URL updated.",
        order,
      });
    } catch (error) {
      console.error("Tracking update error:", error);

      return res.status(500).json({
        message: "Unable to update tracking URL.",
      });
    }
  }
);

// ======================================
// LEGACY ADMIN ORDER LIST
// ======================================

app.get(
  "/api/orders",
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({
        placedAt: -1,
      });

      return res.json(orders);
    } catch (error) {
      console.error("Legacy orders error:", error);

      return res.status(500).json({
        message: "Unable to fetch orders.",
      });
    }
  }
);

// ======================================
// CUSTOMER SUBMITS INQUIRY
// ======================================

app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, phone, service, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required.",
      });
    }

    if (!/^[0-9]{10}$/.test(String(phone).trim())) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number.",
      });
    }

    const inquiry = await Inquiry.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      service: service || "",
      message: message || "",
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);

    return res.status(500).json({
      message: "Unable to submit inquiry.",
    });
  }
});

// ======================================
// ADMIN - GET ALL CUSTOMERS
// ======================================

app.get(
  "/api/admin/customers",
  requireAdmin,
  async (req, res) => {
    try {
      const customers = await User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: customers.length,
        customers,
      });
    } catch (error) {
      console.error("Admin customers error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch customers.",
      });
    }
  }
);

// ======================================
// ADMIN - GET ALL INQUIRIES
// ======================================

app.get(
  "/api/inquiries",
  requireAdmin,
  async (req, res) => {
    try {
      const inquiries = await Inquiry.find().sort({
        createdAt: -1,
      });

      return res.json(inquiries);
    } catch (error) {
      console.error("Inquiry fetch error:", error);

      return res.status(500).json({
        message: "Unable to fetch inquiries.",
      });
    }
  }
);

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  console.error("Unexpected server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ======================================
// EXPORT APP
// ======================================

module.exports = app;

// ======================================
// START SERVER
// ======================================

if (require.main === module) {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing from .env");
    process.exit(1);
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully!");

      app.listen(PORT, () => {
        console.log(
          `Global Systems server running on port ${PORT}`
        );

        console.log("Payment: Razorpay + COD");
        console.log("Customer authentication: Enabled");
        console.log("Admin authentication: Enabled");
      });
    })
    .catch((error) => {
      console.error(
        "MongoDB connection failed:",
        error.message
      );

      process.exit(1);
    });
}
