const axios = require('axios');

const checkUrl = async (url) => {
  try {
    const res = await axios.head(url);
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status}`);
  } catch (err) {
    console.log(`URL: ${url}`);
    console.log(`Error: ${err.message}`);
    if (err.response) {
      console.log(`Response Status: ${err.response.status}`);
    }
  }
};

const run = async () => {
  // Let's test if replacing dhqcwkpzp with dkeceuhqb works for one of the category icons
  const url1 = "https://res.cloudinary.com/dkeceuhqb/image/upload/v1778682206/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png";
  const url2 = "https://res.cloudinary.com/dkeceuhqb/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%281%29.jpg";
  
  await checkUrl(url1);
  console.log("-------------------");
  await checkUrl(url2);
};

run();
