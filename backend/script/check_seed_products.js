const fs = require('fs');

const run = () => {
  const content = fs.readFileSync('utils/products.json', 'utf8');
  const products = JSON.parse(content);
  const matched = products.filter(p => {
    const title = p.title?.en || Object.values(p.title || {})[0] || "";
    return title.toLowerCase().includes("1200mah");
  });
  console.log("Matched in products.json:", matched.length);
  matched.forEach(p => {
    console.log(`- Title: ${p.title?.en || Object.values(p.title || {})[0]} | Images: ${JSON.stringify(p.image)}`);
  });
};

run();
