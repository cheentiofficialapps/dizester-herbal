/**
 * Seed script for minimal data
 * Creates: sales channel, region, products
 */

// Medusa v2.12.3 uses CLI commands
import medusaConfig from "../../medusa-config";

async function seed() {
  console.log("🌱 Starting seed...");

  const medusa = // Use medusa CLI: medusa migrations runmedusaConfig);
  await medusa.init();

  try {
    const salesChannelService = medusa.modules.salesChannel;
    const regionService = medusa.modules.region;
    const productService = medusa.modules.product;

    // Create sales channel if not exists
    let salesChannel;
    const channels = await salesChannelService.listSalesChannels({});
    if (channels.length === 0) {
      salesChannel = await salesChannelService.createSalesChannels({
        name: "Default Channel",
        is_default: true,
      });
      console.log("✅ Created sales channel");
    } else {
      salesChannel = channels[0];
      console.log("ℹ️  Sales channel already exists");
    }

    // Create region if not exists
    let region;
    const regions = await regionService.listRegions({});
    if (regions.length === 0) {
      region = await regionService.createRegions({
        name: "US",
        currency_code: "usd",
        countries: ["us"],
      });
      console.log("✅ Created region");
    } else {
      region = regions[0];
      console.log("ℹ️  Region already exists");
    }

    // Create sample product if not exists
    const products = await productService.listProducts({});
    if (products.length === 0) {
      await productService.createProducts({
        title: "Sample Product",
        description: "A sample product for testing",
        status: "published",
        variants: [
          {
            title: "Default Variant",
            prices: [
              {
                amount: 1000, // $10.00
                currency_code: "usd",
              },
            ],
            inventory_quantity: 100,
          },
        ],
      });
      console.log("✅ Created sample product");
    } else {
      console.log("ℹ️  Products already exist");
    }

    console.log("✅ Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();

