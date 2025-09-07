const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/stream', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Please provide a URL like ?url=https://example.com");

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);

    res.send(`Opened: ${url}`);
    // ممكن لاحقاً تضيف لقطة شاشة أو بث مباشر
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading page");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/stream?url=https://www.youtube.com`);
});
