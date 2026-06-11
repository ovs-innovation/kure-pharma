require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testApi = async () => {
  console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    // List ALL resources without prefix filter
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 50,
    });

    console.log("\n=== ALL IMAGES IN dkeceuhqb ===");
    console.log("Total found:", result.resources.length);
    result.resources.forEach((r) => {
      console.log(" folder:", r.folder || "(root)", "| public_id:", r.public_id);
    });

    if (result.next_cursor) {
      console.log("(more assets exist...)");
    }
  } catch (e) {
    console.error("API Error:", e.message);
  }

  process.exit();
};

testApi();
