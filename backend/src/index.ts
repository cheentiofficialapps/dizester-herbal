import { Medusa } from "@medusajs/medusa";
import express from "express";
import cors from "cors";
import medusaConfig from "../medusa-config";
import apiRoutes from "./api/routes";

const medusa = new Medusa(medusaConfig);

// Run migrations on startup (idempotent)
medusa.on("application:beforeStart", async () => {
  try {
    await medusa.runMigrations();
    console.log("✅ Migrations completed");
  } catch (error) {
    console.error("❌ Migration error:", error);
    // Don't throw - migrations might already be applied
  }
});

// Add custom API routes
medusa.on("application:beforeStart", async () => {
  const app = medusa.getExpressApp();
  
  // Enable CORS
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        ...(process.env.STORE_CORS?.split(",") || []),
        ...(process.env.ADMIN_CORS?.split(",") || []),
        ...(process.env.AUTH_CORS?.split(",") || []),
      ].map(o => o.trim()).filter(Boolean);
      
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));

  // Mount custom API routes with medusa instance
  app.use("/api", apiRoutes(medusa));
  console.log("✅ Custom API routes mounted");
});

// Start server
const PORT = process.env.PORT || 9000;

medusa.start().then(() => {
  console.log(`🚀 Medusa server started on port ${PORT}`);
}).catch((error) => {
  console.error("❌ Failed to start Medusa:", error);
  process.exit(1);
});
