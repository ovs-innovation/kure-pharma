require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

const DUMMY_SLUGS = ["jhgjgj", "wdsadsad", "tranfomer", "transformer-testing", "klkljl", "mobile"];
const DUMMY_TITLE_KEYWORDS = ["jhgjgj", "wdsadsad", "tranfomer", "ffgf", "klkljl", "wdsadsad"];

const isDummy = (p) => {
  const titleStr = JSON.stringify(p.title || {}).toLowerCase();
  const slugStr = (p.slug || "").toLowerCase();
  return DUMMY_SLUGS.includes(slugStr) || DUMMY_TITLE_KEYWORDS.some(k => titleStr.includes(k));
};

const getTitle = (p) => {
  if (!p.title) return "(no title)";
  return p.title.en || p.title.hi || Object.values(p.title)[0] || "(no title)";
};

const getTags = (p) => {
  if (!p.tag || p.tag.length === 0) return "(none)";
  return p.tag.join(", ");
};

const hasImage = (p) => p.image && p.image.length > 0 && p.image[0];
const hasCategory = (p) => p.category || (p.categories && p.categories.length > 0);

const audit = async () => {
  await connectDB();
  const all = await Product.find({}).lean();

  const show = all.filter(p => p.status === "show");
  const hide = all.filter(p => p.status === "hide");
  const popular = all.filter(p => p.type === "popular");
  const trending = all.filter(p => p.type === "trending");
  const newType = all.filter(p => p.type === "new");
  const featured = all.filter(p => p.tag && p.tag.some(t => typeof t === "string" && t.toLowerCase().includes("featured")));
  const dummies = all.filter(isDummy);
  const noImage = show.filter(p => !hasImage(p));
  const noCategory = show.filter(p => !hasCategory(p));

  const output = {
    summary: {
      total: all.length,
      show: show.length,
      hide: hide.length,
      popular: popular.length,
      trending: trending.length,
      newType: newType.length,
      featured: featured.length,
      dummies: dummies.length,
      showNoImage: noImage.length,
      showNoCategory: noCategory.length,
    },
    popularProducts: popular.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
      isDummy: isDummy(p),
    })),
    trendingProducts: trending.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
      isDummy: isDummy(p),
    })),
    newProducts: newType.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
      isDummy: isDummy(p),
    })),
    featuredProducts: featured.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
      isDummy: isDummy(p),
    })),
    dummyProducts: dummies.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
    })),
    showNoImage: noImage.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      status: p.status,
    })),
    showNoCategory: noCategory.map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      status: p.status,
    })),
    // All real showing products (for recommendation phase)
    allShowingReal: show.filter(p => !isDummy(p)).map(p => ({
      id: p._id.toString(),
      name: getTitle(p),
      type: p.type,
      tag: getTags(p),
      status: p.status,
      hasImage: !!hasImage(p),
      hasCategory: !!hasCategory(p),
    })),
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit();
};

audit();
