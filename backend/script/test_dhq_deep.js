/**
 * Try to download dhqcwkpzp images via the Admin API /resource endpoint
 * which returns the actual bytes, bypassing CDN delivery restrictions
 */

const cloudinary = require("cloudinary").v2;
const https = require("https");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: "dhqcwkpzp",
  api_key: "918188866222843",
  api_secret: "i2NAkPIV4McmjTgULRYV2hltLY8",
});

// Try listing what's actually in the account
const run = async () => {
  console.log("=== Testing dhqcwkpzp Admin API ===\n");

  // 1. Try to get all resources
  try {
    const res = await cloudinary.api.resources({ max_results: 10 });
    console.log("All resources:", res.resources.length);
    res.resources.forEach(r => console.log(" -", r.public_id, r.secure_url.substring(0, 60)));
  } catch (e) {
    console.log("List resources error:", e.http_code, e.message || JSON.stringify(e));
  }

  // 2. Try to get a specific resource info
  try {
    const res = await cloudinary.api.resource("category/ChatGPTImageMay13,2026,07_52_56PM");
    console.log("\nResource info:", JSON.stringify(res, null, 2).substring(0, 400));
  } catch (e) {
    console.log("\nGet resource error:", e.http_code, e.message || JSON.stringify(e));
  }

  // 3. Check account usage / ping
  try {
    const usage = await cloudinary.api.usage();
    console.log("\nAccount usage:", JSON.stringify(usage).substring(0, 200));
  } catch (e) {
    console.log("\nUsage error:", e.http_code, e.message || JSON.stringify(e));
  }

  // 4. Try to ping the account
  try {
    const ping = await cloudinary.api.ping();
    console.log("\nPing:", JSON.stringify(ping));
  } catch (e) {
    console.log("\nPing error:", e.http_code, e.message || JSON.stringify(e));
  }

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
