const puppeteer = require("puppeteer");

async function searchBing(query) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Set user agent to prevent Bing from blocking the script
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Set browser language to English
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  try {
    // Go directly to the Bing search results page
    await page.goto(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      { waitUntil: "networkidle2" }
    );

    // Wait for the search results to load
    await page.waitForSelector(".b_algo h2");

    // Extract and print the search result titles
    const results = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll(".b_algo h2"));
      return titles
        .map((title) => title.innerText)
        .filter((text) => text.trim() !== "");
    });

    console.log("Search results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Generate a random word for the search query
const randomWords = [
  "puppeteer",
  "javascript",
  "nodejs",
  "automation",
  "web scraping",
];
const randomQuery = randomWords[Math.floor(Math.random() * randomWords.length)];

// Search for the random word
searchBing(randomQuery)
  .then(() => console.log("Search completed"))
  .catch((err) => console.error("Error:", err));
