/**
 * RECOVERY AUDIT SCRIPT
 * 
 * This script:
 * 1. Shows ALL current DB image URLs (to know what we have now)
 * 2. Tests if dhqcwkpzp URLs can be accessed with any signed approach
 * 3. Reports the state BEFORE any further changes
 */

require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const https = require("https");

const testUrl = (url) => new Promise((resolve) => {
  const req = https.request(url, { method: "HEAD" }, (res) => resolve(res.statusCode));
  req.on("error", () => resolve("ERR"));
  req.setTimeout(4000, () => { req.destroy(); resolve("TIMEOUT"); });
  req.end();
});

const run = async () => {
  await connectDB();

  console.log("========================================");
  console.log("RECOVERY AUDIT - CURRENT DB STATE");
  console.log("========================================\n");

  const cats = await Category.find({}).lean();
  console.log("--- CATEGORIES ---");
  for (const c of cats) {
    const name = c.name?.en || Object.values(c.name || {})[0] || "?";
    const icon = c.icon || "";
    const cloud = icon.match(/res\.cloudinary\.com\/([^/]+)/)?.[1] || (icon ? "other" : "EMPTY");
    const status = icon.includes("dhqcwkpzp") ? await testUrl(icon) : (icon ? "OK(dke)" : "EMPTY");
    console.log(`  [${status}] ${name} | ${cloud} | ${icon.substring(0, 70)}`);
  }

  const prods = await Product.find({}).lean();
  console.log("\n--- PRODUCTS WITH IMAGES ---");
  let brokenProds = 0;
  for (const p of prods) {
    if (!p.image || p.image.length === 0) continue;
    const hasDhq = p.image.some(u => u.includes("dhqcwkpzp"));
    if (!hasDhq) continue;
    const title = p.title?.en || Object.values(p.title || {})[0] || "?";
    console.log(`  Product: ${title.substring(0, 60)} [status:${p.status}]`);
    for (const u of p.image) {
      const s = u.includes("dhqcwkpzp") ? await testUrl(u) : "OK(dke)";
      console.log(`    [${s}] ${u.substring(0, 80)}`);
    }
    brokenProds++;
  }
  if (brokenProds === 0) console.log("  (none with dhqcwkpzp)");

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
