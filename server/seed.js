
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const sampleProducts = [
  {
    category: "Laptop",
    name: "JioBook 11",
    basePrice: 10990,
    image: "/images/products/jiobook.jpg",
    description: "Compact laptop for everyday computing, study and basic office work."
  },
  {
    category: "Laptop",
    name: "Lenovo IdeaPad Slim 3",
    basePrice: 39499,
    image: "/images/products/lenovo.jpg",
    description: "Slim everyday laptop suitable for office, study and professional use."
  },
  {
    category: "RAM",
    name: "Patriot 16GB DDR4 RAM",
    basePrice: 12099,
    image: "/images/products/ram.jpg",
    description: "16GB DDR4 memory for compatible desktop and laptop systems."
  },
  {
    category: "SSD",
    name: "Zebronics 512GB SSD",
    basePrice: 5999,
    image: "/images/products/ssd.jpg",
    description: "512GB solid-state storage for faster everyday computing."
  },
  {
    category: "Mouse",
    name: "Dell MS116 Mouse",
    basePrice: 800,
    image: "/images/products/mouse.jpg",
    description: "Simple and reliable wired mouse for everyday computer use."
  },
  {
    category: "Keyboard",
    name: "Portronics Bubble 3.0 Keyboard",
    basePrice: 879,
    image: "/images/products/keyboard.jpg",
    description: "Comfortable keyboard for home, office and everyday computing."
  },
  {
    category: "CCTV",
    name: "CP Plus CCTV Combo",
    basePrice: 6960,
    image: "/images/products/cctv.jpg",
    description: "Security camera solution for homes, offices and businesses."
  },
  {
    category: "UPS",
    name: "UPS Protector 725",
    basePrice: 2543,
    image: "/images/products/ups.jpg",
    description: "Power backup solution for computers and electronic equipment."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB...");

    await Product.deleteMany({});

    console.log("Old products deleted.");

    await Product.insertMany(sampleProducts);

    console.log("8 sample products added successfully!");

  } catch (error) {
    console.error("Seeding error:", error.message);

  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();