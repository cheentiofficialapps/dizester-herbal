import { Request, Response } from "express";
import { Medusa } from "@medusajs/medusa";

export function createBootstrapHandler(medusa: Medusa) {
  /**
   * One-time bootstrap endpoint
   * 
   * Creates:
   * 1. Admin user (if not exists)
   * 2. Publishable API key (if not exists)
   * 
   * Security: Requires BOOTSTRAP_TOKEN in Authorization header
   * After successful use, this endpoint should be disabled
   */
  return async function POST(
    req: Request,
    res: Response
  ): Promise<void> {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.BOOTSTRAP_TOKEN;

  // Validate bootstrap token
  if (!expectedToken) {
    res.status(500).json({ 
      error: "Bootstrap is not configured. BOOTSTRAP_TOKEN not set." 
    });
    return;
  }

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    res.status(401).json({ 
      error: "Unauthorized. Valid BOOTSTRAP_TOKEN required." 
    });
    return;
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        error: "email and password are required" 
      });
      return;
    }

    // Use the provided Medusa instance (already initialized)

    // Get user service
    const userService = medusa.modules.user;
    const publishableApiKeyService = medusa.modules.publishableApiKey;
    const salesChannelService = medusa.modules.salesChannel;

    // Check if admin user exists
    let adminUser;
    try {
      const users = await userService.listUsers({
        email,
      });
      adminUser = users.length > 0 ? users[0] : null;
    } catch (error) {
      // User might not exist, continue
    }

    // Create admin user if not exists
    if (!adminUser) {
      try {
        adminUser = await userService.createUsers({
          email,
          password,
          role: "admin",
        });
        console.log(`✅ Created admin user: ${email}`);
      } catch (error: any) {
        // If user creation fails, try to get existing user
        const users = await userService.listUsers({ email });
        if (users.length > 0) {
          adminUser = users[0];
        } else {
          throw error;
        }
      }
    } else {
      console.log(`ℹ️  Admin user already exists: ${email}`);
    }

    // Get or create default sales channel
    let salesChannel;
    try {
      const channels = await salesChannelService.listSalesChannels({});
      salesChannel = channels.length > 0 ? channels[0] : null;
      
      if (!salesChannel) {
        salesChannel = await salesChannelService.createSalesChannels({
          name: "Default Channel",
          is_default: true,
        });
        console.log("✅ Created default sales channel");
      }
    } catch (error: any) {
      console.error("Error with sales channel:", error);
      // Continue without sales channel association
    }

    // Check if publishable key exists
    let publishableKey;
    try {
      const keys = await publishableApiKeyService.listPublishableApiKeys({});
      publishableKey = keys.length > 0 ? keys[0] : null;
    } catch (error) {
      // No keys exist
    }

    // Create publishable key if not exists
    if (!publishableKey) {
      try {
        publishableKey = await publishableApiKeyService.createPublishableApiKeys({
          title: "Default Publishable Key",
        });

        // Associate with sales channel if available
        if (salesChannel) {
          await publishableApiKeyService.addSalesChannelsToPublishableApiKey(
            publishableKey.id,
            [salesChannel.id]
          );
        }

        console.log("✅ Created publishable API key");
      } catch (error: any) {
        console.error("Error creating publishable key:", error);
        res.status(500).json({ 
          error: "Failed to create publishable key",
          details: error.message 
        });
        return;
      }
    } else {
      console.log("ℹ️  Publishable key already exists");
    }

    // Return success with publishable key
    res.status(200).json({
      success: true,
      publishableKey: publishableKey.token,
      message: "Bootstrap completed successfully",
    });

    // Note: In production, you should disable this endpoint after first use
    // by removing or invalidating BOOTSTRAP_TOKEN
    console.log("⚠️  WARNING: Bootstrap completed. Disable this endpoint by removing BOOTSTRAP_TOKEN.");

  } catch (error: any) {
    console.error("Bootstrap error:", error);
    res.status(500).json({ 
      error: "Bootstrap failed",
      details: error.message 
    });
  }
  };
}

