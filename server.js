// server.js
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 8080;

// المتصفح يفتح مرة واحدة
let browser, page;

// تشغيل Puppeteer عند بداية السيرفر
(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  console.log("✅ Puppeteer started");
})();

// رابط البث
app.get("/stream", async (req, res) => {
  const url = req.query.url || "https://www.youtube.com";

  try {
    // افتح الموقع إذا مش مفتوح
    if (page.url() !== url) {
      await page.goto(url, { waitUntil: "networkidle2" });
    }

    // الهيدر للبث
    res.writeHead(200, {
      "Content-Type": "multipart/x-mixed-replace; boundary=frame",
      "Cache-Control": "no-cache",
      "Connection": "close",
      "Pragma": "no-cache",
    });

    console.log(`📺 Streaming screenshots of ${url}`);

    // كل ثانية نرسل لقطة شاشة
    const interval = setInterval(async () => {
      try {
        const screenshot = await page.screenshot({ type: "jpeg", quality: 70 });
        res.write(`--frame\r\n`);
        res.write("Content-Type: image/jpeg\r\n\r\n");
        res.write(screenshot);
        res.write("\r\n");
      } catch (e) {
        clearInterval(interval);
        res.end();
      }
    }, 1000);

    req.on("close", () => {
      clearInterval(interval);
      console.log("❌ Client disconnected");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error starting stream");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/stream?url=https://www.youtube.com`);
});
