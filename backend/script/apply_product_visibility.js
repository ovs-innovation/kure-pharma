require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

// ─── Products to HIDE (dummy/test records) ────────────────────────────────────
const DUMMY_IDS = [
  "69afe69c6d763e22e81daa76", // jhgjgj
  "69aff1eac39dd734e46b2ff1", // wdsadsad (trending)
  "69b263a9df8a1611e8ec10b6", // tranfomer (popular)
  "69b3b755a2b7ae47a8643fe1", // Transformer testing (popular)
  "69b93bd432953536f4ddd64d", // ffgf
  "69d0ba4e613ecc440c819e2f", // Mobile
];

// ─── Products → type: "popular" (12 products) ────────────────────────────────
// Strategy: 18650 cell + DALY 4S key variants + JBD 4S key variants
const POPULAR_IDS = [
  "6a06183bb73dc100134ce499", // 18650 Lithium Ion Cell (hero product)
  "6a06eeb5b73dc100134cec46", // DALY 4S 20A 12V
  "6a083d11b73dc100134cf72a", // DALY 4S 50A 12V
  "6a0d8c17b73dc100134d0137", // DALY 4S 100A 12V
  "6a0daea3b73dc100134d0453", // DALY 8S 20A 24V
  "6a0eed82b73dc100134d07eb", // DALY 8S 100A 24V
  "6a1d6af7b73dc100134d5968", // JBD 4S 20A
  "6a1d7c1bb73dc100134d5a71", // JBD 4S 50A
  "6a1e8bb7287d5800139f2090", // JBD 4S 100A
  "6a1eaeb6287d5800139f21b6", // JBD 8S 20A
  "6a1ebe1e287d5800139f22aa", // JBD 8S 100A
  "6a1ed851287d5800139f23f4", // JBD 8S 200A
];

// ─── Products → type: "trending" (10 products) ──────────────────────────────
// Strategy: Mid-high amp variants across different voltage series
const TRENDING_IDS = [
  "6a070cb8b73dc100134cf012", // DALY 4S 30A
  "6a0854eeb73dc100134cf807", // DALY 4S 60A
  "6a0d94efb73dc100134d014b", // DALY 4S 150A
  "6a0db3b3b73dc100134d0467", // DALY 8S 30A
  "6a0edc17b73dc100134d06ee", // DALY 8S 60A
  "6a0efc62b73dc100134d0891", // DALY 8S 150A
  "6a1d7488b73dc100134d59f8", // JBD 4S 30A
  "6a1d7b5db73dc100134d5a57", // JBD 4S 40A
  "6a1eb032287d5800139f21e1", // JBD 8S 30A
  "6a1ed32a287d5800139f23cd", // JBD 8S 150A
];

// ─── Products → type: "new" (8 most recent products) ────────────────────────
const NEW_IDS = [
  "6a1ed851287d5800139f23f4", // JBD 8S 200A  (but already in popular — use next)
  "6a1ffff5c217e200137b7ff3", // JBD 11S 20A  (2nd newest)
  "6a2003dbc217e200137b81d0", // JBD 15S 40A  (newest)
  "6a1ead2f287d5800139f2197", // JBD 4S 200A
  "6a1ea91f287d5800139f2143", // JBD 4S 150A
  "6a1ea64e287d5800139f2124", // JBD 4S 120A
  "6a1d6856b73dc100134d5954", // DALY 24S 100A
  "6a1d6766b73dc100134d5940", // DALY 24S 50A
];

// ─── Products → tag: ["featured"] (6 flagship products) ────────────────────
const FEATURED_IDS = [
  "6a0da562b73dc100134d0398", // DALY 4S 200A — flagship high current
  "6a0f07a9b73dc100134d096a", // DALY 8S 200A — flagship 24V
  "6a1d621ab73dc100134d58e4", // DALY 23S 100A — EV flagship
  "6a198ff2b73dc100134d5073", // DALY 19S 200A — high power EV
  "6a1ead2f287d5800139f2197", // JBD 4S 200A — flagship JBD
  "6a06183bb73dc100134ce499", // 18650 Cell — hero product
];

const applyUpdates = async () => {
  await connectDB();

  console.log("=== Starting updates ===\n");

  // 1. Hide dummies
  const hideResult = await Product.updateMany(
    { _id: { $in: DUMMY_IDS } },
    { $set: { status: "hide" } }
  );
  console.log(`✅ Hidden ${hideResult.modifiedCount} dummy/test products`);

  // 2. Reset all existing popular/trending/new to "normal" first (clean slate)
  const resetResult = await Product.updateMany(
    { type: { $in: ["popular", "trending", "new"] } },
    { $set: { type: "normal" } }
  );
  console.log(`🔄 Reset ${resetResult.modifiedCount} products to type=normal`);

  // 3. Set popular
  const popularResult = await Product.updateMany(
    { _id: { $in: POPULAR_IDS } },
    { $set: { type: "popular" } }
  );
  console.log(`✅ Set ${popularResult.modifiedCount} products → type=popular`);

  // 4. Set trending
  const trendingResult = await Product.updateMany(
    { _id: { $in: TRENDING_IDS } },
    { $set: { type: "trending" } }
  );
  console.log(`✅ Set ${trendingResult.modifiedCount} products → type=trending`);

  // 5. Set new (avoid overlap with popular/trending)
  const newResult = await Product.updateMany(
    { _id: { $in: NEW_IDS } },
    { $set: { type: "new" } }
  );
  console.log(`✅ Set ${newResult.modifiedCount} products → type=new`);

  // 6. Set featured tag
  const featuredResult = await Product.updateMany(
    { _id: { $in: FEATURED_IDS } },
    { $addToSet: { tag: "featured" } }
  );
  console.log(`✅ Set ${featuredResult.modifiedCount} products → tag=featured`);

  // ── Verification ──────────────────────────────────────────────────────────
  console.log("\n=== Post-Update Verification ===");
  const popular = await Product.countDocuments({ type: "popular", status: "show" });
  const trending = await Product.countDocuments({ type: "trending", status: "show" });
  const newCount = await Product.countDocuments({ type: "new", status: "show" });
  const featured = await Product.countDocuments({ tag: "featured", status: "show" });
  const dummiesStillShow = await Product.countDocuments({ _id: { $in: DUMMY_IDS }, status: "show" });

  console.log(`Popular (show):   ${popular}`);
  console.log(`Trending (show):  ${trending}`);
  console.log(`New (show):       ${newCount}`);
  console.log(`Featured (show):  ${featured}`);
  console.log(`Dummies still showing: ${dummiesStillShow} (should be 0)`);

  process.exit();
};

applyUpdates();
