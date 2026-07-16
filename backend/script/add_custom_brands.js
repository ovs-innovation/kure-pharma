require("dotenv").config();
const mongoose = require("mongoose");
const Brand = require("../models/Brand");

const customBrands = [
  {
    name: "Curemart Pharma",
    slug: "curemart-pharma",
    logo: "/brands/curemart-pharma.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 11
  },
  {
    name: "Cadila Pharmaceuticals",
    slug: "cadila-pharmaceuticals",
    logo: "/brands/cadila.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 12
  },
  {
    name: "Deltamed",
    slug: "deltamed",
    logo: "/brands/deltamed.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 13
  },
  {
    name: "Dr. Reddy's",
    slug: "dr-reddys",
    logo: "/brands/dr-reddys.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 14
  },
  {
    name: "Zydus",
    slug: "zydus",
    logo: "/brands/zydus.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 15
  },
  {
    name: "BDR Pharmaceuticals",
    slug: "bdr-pharmaceuticals",
    logo: "/brands/bdr.svg",
    country: "India",
    featured: true,
    status: "show",
    sortOrder: 16
  }
];

const addBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let addedCount = 0;
    let skippedCount = 0;

    for (const b of customBrands) {
      const exists = await Brand.findOne({ slug: b.slug });
      if (!exists) {
        await Brand.create(b);
        console.log(`Added brand: ${b.name}`);
        addedCount++;
      } else {
        exists.name = b.name;
        exists.logo = b.logo;
        exists.featured = true;
        exists.country = "India";
        exists.status = "show";
        exists.sortOrder = b.sortOrder;
        await exists.save();
        console.log(`Updated existing brand: ${b.name}`);
        skippedCount++;
      }
    }

    console.log(`Completed. Added: ${addedCount}, Updated: ${skippedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Error adding brands:", err);
    process.exit(1);
  }
};

addBrands();
