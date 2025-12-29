import { Router } from "express";

// For Medusa v2.12.3, custom routes should be added via plugins
// This is a placeholder - implement routes via medusa-config.ts plugins
export default function createRoutes() {
  const router = Router();
  
  // Add your custom routes here
  router.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  return router;
}
