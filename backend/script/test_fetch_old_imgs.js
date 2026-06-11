require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const https = require("https");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test if a URL is accessible
const testUrl = (url) => {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD" }, (res) => {
      resolve(res.statusCode);
    });
    req.on("error", () => resolve("ERROR"));
    req.setTimeout(5000, () => { req.destroy(); resolve("TIMEOUT"); });
    req.end();
  });
};

// Generate signed URL for private Cloudinary resource
const getSignedUrl = (publicId, cloudName) => {
  // Try constructing a URL with the active credentials
  return cloudinary.url(publicId, {
    cloud_name: cloudName,
    sign_url: true,
    type: "upload",
    secure: true,
  });
};

const investigate = async () => {
  console.log("=== TESTING BROKEN dhqcwkpzp CATEGORY IMAGE ===\n");

  const oldUrl = "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778682206/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png";
  
  // Test 1: direct URL
  const status1 = await testUrl(oldUrl);
  console.log("Direct URL status:", status1);

  // Test 2: URL without version
  const noVersionUrl = "https://res.cloudinary.com/dhqcwkpzp/image/upload/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png";
  const status2 = await testUrl(noVersionUrl);
  console.log("No-version URL status:", status2);

  // Test 3: Try fetch upload to dkeceuhqb from the old URL
  // (Even if direct access fails, Cloudinary server-to-server might work differently)
  console.log("\n=== ATTEMPTING CLOUDINARY FETCH FROM OLD URL ===");
  try {
    const result = await cloudinary.uploader.upload(oldUrl, {
      folder: "category",
      public_id: "silicon-wire-icon",
      overwrite: false,
    });
    console.log("SUCCESS! New URL:", result.secure_url);
  } catch (e) {
    console.log("Cloudinary fetch failed:", e.message);
  }

  process.exit();
};

investigate();
