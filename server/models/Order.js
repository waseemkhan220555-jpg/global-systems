const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },

  // Link order to the logged-in customer.
  // Optional so older orders remain compatible.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true,
  },

  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      variantName: String,
      basePrice: Number,
      price: Number,
      qty: Number,
      quantity: Number,
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "RAZORPAY"],
    default: "COD",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  razorpayOrderId: {
    type: String,
    default: null,
  },

  razorpayPaymentId: {
    type: String,
    default: null,
  },

  paymentVerifiedAt: {
    type: Date,
    default: null,
  },

  paymentTxnId: {
    type: String,
    default: "",
  },

  orderStatus: {
    type: String,
    enum: [
      "Payment Pending",
      "Order Placed",
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Payment Pending",
  },

  expectedDeliveryDate: {
    type: Date,
    default: null,
  },

  trackingUrl: {
    type: String,
    default: "",
  },

  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          "Payment Pending",
          "Order Placed",
          "Processing",
          "Out for Delivery",
          "Delivered",
          "Cancelled",
        ],
      },
      note: {
        type: String,
        default: "",
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);