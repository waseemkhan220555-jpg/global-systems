const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 10 },
  // Multiple variants/models
  variants: [
    {
      modelName: { type: String }, // e.g., "16GB RAM / 512GB SSD"
      price: { type: Number },
      stock: { type: Number, default: 5 },
      sku: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);