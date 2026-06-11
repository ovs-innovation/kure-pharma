/**
 * MIGRATE ORIGINAL IMAGES FROM dhqcwkpzp TO dkeceuhqb
 *
 * Uses the actual credentials for the old account (dhqcwkpzp) to download
 * the original images and re-upload them to the active account (dkeceuhqb).
 * Then updates the database URLs.
 * 
 * This preserves the exact original images uploaded from the admin panel.
 */

require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const https = require("https");

// ---- OLD account credentials (source) ----
const OLD_CLOUD = {
  cloud_name: "dhqcwkpzp",
  api_key: "918188866222843",
  api_secret: "i2NAkPIV4McmjTgULRYV2hltLY8",
};

// ---- NEW account credentials (destination) ----
const NEW_CLOUD = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // dkeceuhqb
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Generate a signed download URL from dhqcwkpzp so we can fetch the real image
const getSignedDownloadUrl = (originalUrl) => {
  // Configure old cloudinary temporarily to generate signed URL
  const cloudinaryOld = require("cloudinary").v2;
  cloudinaryOld.config(OLD_CLOUD);
  
  // Extract public_id from URL
  // e.g. https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778682206/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png
  const match = originalUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) return null;
  
  // Decode the public_id (remove extension)
  let publicId = decodeURIComponent(match[1]);
  // Remove extension
  publicId = publicId.replace(/\.[^.]+$/, "");
  
  const signed = cloudinaryOld.url(publicId, {
    sign_url: true,
    type: "upload",
    secure: true,
    resource_type: "image",
  });
  
  return { signed, publicId };
};

// Test if a URL is accessible
const testUrl = (url) => new Promise((resolve) => {
  const req = https.request(url, { method: "HEAD" }, (res) => resolve(res.statusCode));
  req.on("error", () => resolve("ERR"));
  req.setTimeout(6000, () => { req.destroy(); resolve("TIMEOUT"); });
  req.end();
});

// Download original from dhqcwkpzp using signed URL and upload to dkeceuhqb
const migrateUrl = async (originalUrl, folder, publicIdSuffix) => {
  const result = getSignedDownloadUrl(originalUrl);
  if (!result) {
    console.log(`    ❌ Could not parse public_id from: ${originalUrl}`);
    return null;
  }

  const { signed, publicId } = result;
  console.log(`    Source public_id: ${publicId}`);
  
  // Test if signed URL works
  const signedStatus = await testUrl(signed);
  console.log(`    Signed URL status: ${signedStatus}`);
  
  if (signedStatus !== 200) {
    // Try to fetch directly from old API
    console.log(`    Trying Cloudinary Admin API download...`);
    try {
      // Use old cloudinary instance to fetch the resource
      const oldCloud = require("cloudinary").v2;
      oldCloud.config(OLD_CLOUD);
      
      // Try upload to new account by fetching from old using fetch type
      cloudinary.config(NEW_CLOUD);
      const fetchUrl = `https://res.cloudinary.com/dhqcwkpzp/image/upload/${encodeURIComponent(publicId)}`;
      
      // Generate a signed fetch URL
      const timestamp = Math.round(Date.now() / 1000);
      const crypto = require("crypto");
      const paramStr = `public_id=${publicId}&timestamp=${timestamp}${OLD_CLOUD.api_secret}`;
      const signature = crypto.createHash("sha1").update(paramStr).digest("hex");
      
      // Try authenticated download
      const authUrl = `https://api.cloudinary.com/v1_1/dhqcwkpzp/image/upload/${publicId}?api_key=${OLD_CLOUD.api_key}&timestamp=${timestamp}&signature=${signature}`;
      const authStatus = await testUrl(authUrl);
      console.log(`    Auth API URL status: ${authStatus}`);
    } catch(e) {
      console.log(`    Auth attempt error: ${e.message}`);
    }
    return null;
  }

  // Upload signed URL to new account
  try {
    cloudinary.config(NEW_CLOUD);
    const uploadResult = await cloudinary.uploader.upload(signed, {
      folder: folder,
      public_id: publicIdSuffix,
      overwrite: true,
      resource_type: "image",
    });
    return uploadResult.secure_url;
  } catch (e) {
    console.log(`    ❌ Upload failed: ${e.message}`);
    return null;
  }
};

const run = async () => {
  await connectDB();

  console.log("==============================================");
  console.log("MIGRATING ORIGINAL IMAGES: dhqcwkpzp → dkeceuhqb");
  console.log("Using actual dhqcwkpzp API credentials");
  console.log("==============================================\n");

  cloudinary.config(NEW_CLOUD);
  
  const cats = await Category.find({}).lean();
  let catFixed = 0;

  for (const cat of cats) {
    if (!cat.icon || !cat.icon.includes("dhqcwkpzp")) continue;
    const name = cat.name?.en || Object.values(cat.name || {})[0] || cat.slug;
    console.log(`\nCategory: ${name} (${cat.slug})`);
    
    const newUrl = await migrateUrl(cat.icon, "category", `orig-${cat.slug}`);
    if (newUrl) {
      await Category.findByIdAndUpdate(cat._id, { icon: newUrl });
      console.log(`    ✅ Migrated → ${newUrl.substring(0, 70)}`);
      catFixed++;
    } else {
      console.log(`    ⚠️  Could not migrate — original URL kept in DB`);
    }
    await sleep(400);
  }

  console.log(`\n\nCategories migrated: ${catFixed}`);

  // Now handle products
  const prods = await Product.find({}).lean();
  let prodFixed = 0;

  for (const prod of prods) {
    if (!prod.image || !prod.image.some(u => u.includes("dhqcwkpzp"))) continue;
    const title = prod.title?.en || Object.values(prod.title || {})[0] || "?";
    console.log(`\nProduct: ${title.substring(0, 60)}`);

    const newImages = [];
    let i = 0;
    for (const imgUrl of prod.image) {
      if (!imgUrl.includes("dhqcwkpzp")) {
        newImages.push(imgUrl);
        continue;
      }
      const newUrl = await migrateUrl(imgUrl, "product", `orig-${prod._id}-${i}`);
      newImages.push(newUrl || imgUrl); // keep original URL if migration fails
      i++;
      await sleep(400);
    }

    if (newImages.some((u, idx) => u !== prod.image[idx])) {
      await Product.findByIdAndUpdate(prod._id, { image: newImages });
      prodFixed++;
      console.log(`  ✅ Product images updated`);
    }
  }

  console.log(`\nProducts migrated: ${prodFixed}`);
  console.log("\n==============================================");
  console.log("DONE");
  console.log("==============================================");

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
