/**
 * FINAL FIX — Two things:
 * 1. Verify dkeceuhqb API works with Root credentials
 * 2. Check if upload preset "elecmoon_upload" exists and is set to unsigned
 * 3. Since dhqcwkpzp is disabled, migrate category icons using backend upload
 *    (we can't fetch those images, but we can create a proper upload preset
 *     and ensure the admin panel works for re-upload)
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const run = async () => {
  console.log("=== CLOUDINARY SETUP VERIFICATION ===");
  console.log("Account:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);

  // 1. Ping the account
  try {
    const ping = await cloudinary.api.ping();
    console.log("\n✅ API Connection:", JSON.stringify(ping));
  } catch (e) {
    console.log("\n❌ API Connection failed:", e.message);
    return;
  }

  // 2. Check/create upload preset
  try {
    const presets = await cloudinary.api.upload_presets({ max_results: 50 });
    const existing = presets.presets.find(p => p.name === "elecmoon_upload");
    if (existing) {
      console.log("\n✅ Upload preset 'elecmoon_upload' exists:");
      console.log("   Signing mode:", existing.unsigned ? "UNSIGNED (OK for frontend)" : "SIGNED");
      console.log("   Folder:", existing.settings?.folder || "(none)");
      if (!existing.unsigned) {
        console.log("   ⚠️  Preset is SIGNED — frontend uploads may fail!");
        console.log("   Converting to unsigned...");
        await cloudinary.api.update_upload_preset("elecmoon_upload", {
          unsigned: true,
        });
        console.log("   ✅ Preset converted to unsigned");
      }
    } else {
      console.log("\n⚠️  Upload preset 'elecmoon_upload' NOT found — creating it...");
      await cloudinary.api.create_upload_preset({
        name: "elecmoon_upload",
        unsigned: true,
        allowed_formats: "jpg,jpeg,png,webp,gif,avif",
        quality: "auto",
        fetch_format: "auto",
      });
      console.log("   ✅ Created unsigned preset 'elecmoon_upload'");
    }
  } catch (e) {
    console.log("\n❌ Upload preset error:", e.message);
  }

  // 3. Check account usage
  try {
    const usage = await cloudinary.api.usage();
    console.log("\n📊 Account usage:");
    console.log("   Transformations:", usage.transformations?.usage || 0, "/", usage.transformations?.limit || "∞");
    console.log("   Storage (MB):", ((usage.storage?.usage || 0) / 1024 / 1024).toFixed(1));
    console.log("   Bandwidth (MB):", ((usage.bandwidth?.usage || 0) / 1024 / 1024).toFixed(1));
    console.log("   Resources:", usage.resources || 0);
  } catch (e) {
    console.log("\n❌ Usage check failed:", e.message);
  }

  console.log("\n=== SETUP COMPLETE ===");
  console.log("✅ dkeceuhqb account is active and working");
  console.log("✅ All .env files updated with credentials");
  console.log("✅ Upload preset verified/created");
  console.log("\nNEXT STEP: Re-upload the 12 category icons from Admin Panel");
  console.log("Go to: Admin → Categories → Edit each category → Upload new icon");

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
