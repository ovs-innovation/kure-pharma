require("dotenv").config();
const Product = require("../../models/Product");

const handleProductQuantity = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) return;

  const failures = [];

  for (const p of cart) {
    const productId = p?._id || p?.id;
    const quantity = parseInt(p?.quantity, 10) || 0;
    if (!productId || quantity <= 0) continue;

    const product = await Product.findById(productId).select(
      "trackInventory stock title"
    );

    if (!product?.trackInventory) continue;

    const updated = await Product.findOneAndUpdate(
      { _id: productId, trackInventory: true, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!updated) {
      failures.push(String(productId));
    }
  }

  if (failures.length) {
    throw new Error(
      `Stock update failed for product(s): ${failures.join(", ")}`
    );
  }
};

const handleProductAttribute = async (key, value, multi) => {
  try {
    const products = await Product.find({ isCombination: true });

    if (multi) {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: { $in: value } },
            },
          }
        );
      }
    } else {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: value },
            },
          }
        );
      }
    }
  } catch (err) {
    console.log("err, when delete product variants", err.message);
  }
};

module.exports = {
  handleProductQuantity,
  handleProductAttribute,
};
