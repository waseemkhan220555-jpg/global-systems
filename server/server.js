const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");

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
      message: "Invalid admin key. Access denied.",
    });
  }

  next();
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
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Global Systems API is running!",
    payment: "PhonePe / UPI QR",
  });
});

// ======================================
// PRODUCT APIs
// ======================================

// GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    console.error("Product fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
});

// GET SINGLE PRODUCT
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

    res.json(product);
  } catch (error) {
    console.error("Single product error:", error);

    res.status(500).json({
      message: "Unable to fetch product.",
    });
  }
});

// ADD PRODUCT - ADMIN ONLY
app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE PRODUCT - ADMIN ONLY
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

      res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        message: "Unable to delete product.",
      });
    }
  }
);

// ======================================
// ORDER CREATION
// ======================================

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    // CUSTOMER VALIDATION
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

    // CART VALIDATION
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    if (items.length > 50) {
      return res.status(400).json({
        message: "Too many products in one order.",
      });
    }

    // PAYMENT METHOD
    let finalPaymentMethod;

    if (
      paymentMethod === "UPI" ||
      paymentMethod === "UPI_QR"
    ) {
      finalPaymentMethod = "UPI_QR";
    } else if (paymentMethod === "COD") {
      finalPaymentMethod = "COD";
    } else {
      return res.status(400).json({
        message: "Choose PhonePe/UPI QR or Cash on Delivery.",
      });
    }

    // VERIFY PRODUCTS AND PRICES
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

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: "Invalid product price.",
        });
      }

      if (
        product.stock !== undefined &&
        product.stock !== null &&
        Number(product.stock) < quantity
      ) {
        return res.status(400).json({
          message: `${product.name} is out of stock.`,
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

    // GENERATE ORDER ID
    const orderId =
      "ORD-" +
      Date.now() +
      "-" +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    // SAVE ORDER
    const order = await Order.create({
      orderId,

      customer: {
        name,
        phone,
        address,
        pincode,
        coordinates: customer.coordinates || undefined,
      },

      items: verifiedItems,
      totalAmount,

      paymentMethod: finalPaymentMethod,

      paymentStatus: "Pending",
      orderStatus: "Order Placed",
      trackingUrl: "",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to place order.",
    });
  }
});

// ======================================
// CUSTOMER ORDER TRACKING
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

    res.json({
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

    res.status(500).json({
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

      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Admin orders error:", error);

      res.status(500).json({
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

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Single order error:", error);

      res.status(500).json({
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

      order.orderStatus = orderStatus;

      await order.save();

      res.json({
        success: true,
        message: "Order status updated.",
        order,
      });
    } catch (error) {
      console.error("Order status update error:", error);

      res.status(500).json({
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

      order.paymentStatus = paymentStatus;

      if (paymentTxnId !== undefined) {
        order.paymentTxnId = String(paymentTxnId).trim();
      }

      await order.save();

      res.json({
        success: true,
        message: "Payment status updated.",
        order,
      });
    } catch (error) {
      console.error("Payment update error:", error);

      res.status(500).json({
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

      res.json({
        success: true,
        message: "Tracking URL updated.",
        order,
      });
    } catch (error) {
      console.error("Tracking update error:", error);

      res.status(500).json({
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

      res.json(orders);
    } catch (error) {
      console.error("Legacy orders error:", error);

      res.status(500).json({
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

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);

    res.status(500).json({
      message: "Unable to submit inquiry.",
    });
  }
});

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

      // Return an array to match Admin.jsx
      res.json(inquiries);
    } catch (error) {
      console.error("Inquiry fetch error:", error);

      res.status(500).json({
        message: "Unable to fetch inquiries.",
      });
    }
  }
);

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ======================================
// SERVER START
// ======================================

// ======================================
// SERVER START / VERCEL EXPORT
// ======================================

// Export Express app for Vercel
module.exports = app;

// Run normally when starting locally
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

        console.log("Payment: PhonePe / UPI QR + COD");
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