import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const app = require("../server/server.js");

let cachedConnection = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing.");
  }

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(
      process.env.MONGO_URI
    );
  }

  try {
    await cachedConnection;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel backend error:", error);

    return res.status(500).json({
      success: false,
      message: "Backend connection failed.",
    });
  }
}