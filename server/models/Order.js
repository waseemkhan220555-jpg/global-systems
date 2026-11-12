const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },

    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: String, required: true },

        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },

            name: String,
            variantName: String,

            basePrice: Number,
            price: Number,

            qty: Number,
            quantity: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'UPI_QR', 'RAZORPAY'],
        default: 'COD'
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },

    paymentTxnId: String,

    orderStatus: {
        type: String,
        enum: [
            'Order Placed',
            'Processing',
            'Out for Delivery',
            'Delivered',
            'Cancelled'
        ],
        default: 'Order Placed'
    },

    // Expected parcel delivery date
    expectedDeliveryDate: {
        type: Date,
        default: null
    },

    // External courier tracking link, if available
    trackingUrl: {
        type: String,
        default: ""
    },

    // Records changes to the order status
    statusHistory: [
        {
            status: {
                type: String,
                enum: [
                    'Order Placed',
                    'Processing',
                    'Out for Delivery',
                    'Delivered',
                    'Cancelled'
                ]
            },

            note: {
                type: String,
                default: ""
            },

            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    placedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);