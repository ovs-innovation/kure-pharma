require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    const email = "admin@kurepharma.com";
    const password = "KurePharmaAdmin2026!";
    const hashedPassword = bcrypt.hashSync(password, 10);

    const updateData = {
      name: { en: "Super Admin" },
      email: email,
      password: hashedPassword,
      phone: "1234567890",
      role: "Super Admin",
      status: "Active",
      joiningData: new Date(),
      access_list: [
        "dashboard",
        "products",
        "product",
        "categories",
        "attributes",
        "coupons",
        "orders",
        "order",
        "our-staff",
        "settings",
        "languages",
        "currencies",
        "store",
        "customization",
        "store-settings",
        "notifications",
        "edit-profile",
        "coming-soon",
        "customers",
        "customer-order",
      ],
    };

    const admin = await Admin.findOneAndUpdate({ email: email }, updateData, {
      new: true,
      upsert: true,
    });

    console.log("Admin account successfully created/updated:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Error creating/updating admin:", err);
    process.exit(1);
  }
};

run();
