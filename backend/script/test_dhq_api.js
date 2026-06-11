/**
 * Quick test: Can we access dhqcwkpzp resources via the Admin API?
 */

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhqcwkpzp",
  api_key: "918188866222843",
  api_secret: "i2NAkPIV4McmjTgULRYV2hltLY8",
});

const run = async () => {
  console.log("Testing dhqcwkpzp Admin API access...");

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "category",
      max_results: 30,
    });
    console.log("\n=== CATEGORY IMAGES IN dhqcwkpzp ===");
    console.log("Count:", result.resources.length);
    result.resources.forEach(r => {
      console.log(" -", r.secure_url);
    });
  } catch (e) {
    console.log("Category API error:", e.message);
  }

  try {
    const result2 = await cloudinary.api.resources({
      type: "upload",
      prefix: "product",
      max_results: 30,
    });
    console.log("\n=== PRODUCT IMAGES IN dhqcwkpzp ===");
    console.log("Count:", result2.resources.length);
    result2.resources.forEach(r => {
      console.log(" -", r.secure_url);
    });
  } catch (e) {
    console.log("Product API error:", e.message);
  }

  // Test if a known URL is now accessible via signed URL
  const { createHmac } = require("crypto");
  const publicId = "category/ChatGPTImageMay13%2C2026%2C07_52_56PM";
  const decodedId = decodeURIComponent(publicId);

  const signed = cloudinary.url(decodedId, {
    sign_url: true,
    type: "upload",
    secure: true,
  });
  console.log("\nSigned URL:", signed);

  const https = require("https");
  const testUrl = (url) => new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD" }, (res) => {
      console.log("  Status:", res.statusCode);
      resolve(res.statusCode);
    });
    req.on("error", e => { console.log("  Error:", e.message); resolve("ERR"); });
    req.setTimeout(8000, () => { req.destroy(); resolve("TIMEOUT"); });
    req.end();
  });

  await testUrl(signed);
  
  // Also test direct unsigned
  const direct = "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778682206/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png";
  console.log("\nDirect URL test:");
  await testUrl(direct);

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
