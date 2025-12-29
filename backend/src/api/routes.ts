import { Router } from "express";
import { Medusa } from "@medusajs/medusa";
import { createBootstrapHandler } from "./bootstrap/route";

export default function createRoutes(medusa: Medusa) {
  const router = Router();
  
  // Bootstrap endpoint
  router.post("/bootstrap", createBootstrapHandler(medusa));
  
  return router;
}

