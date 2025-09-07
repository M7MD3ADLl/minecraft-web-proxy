const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/stream", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("❌ Missing ?url parameter");
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // استرجاع عنوان الصفحة كاختبار
    const title = await page.title();

    res.send(`✅ Opened: ${url} | Page Title: ${title}`);

    await browser.close();
  } catch (err) {
    console.error("Puppeteer error:", err);
    res.status(500).send("❌ Failed to open page");
  }
});

// لازم يستمع على 0.0.0.0 مش localhost عشان Render يوصل له
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}/stream?url=https://www.youtube.com`);
});
