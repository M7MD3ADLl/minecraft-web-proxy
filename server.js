// server.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

// 📂 مكان تخزين الصور والصوت
const IMAGE_DIR = "./frames";
const AUDIO_DIR = "./audio";

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR);
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR);

// إعداد multer لرفع الملفات
const upload = multer({ dest: "uploads/" });

// ✅ استقبال الصور من المود (frame.jpg)
app.post("/upload/frame", upload.single("frame"), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(IMAGE_DIR, "latest.jpg");

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).send("❌ Error saving frame");
    res.send("✅ Frame received");
  });
});

// ✅ استقبال الصوت (chunk.wav)
app.post("/upload/audio", upload.single("audio"), (req, res) => {
  const tempPath = req.file.path;
  const fileName = `chunk_${Date.now()}.wav`;
  const targetPath = path.join(AUDIO_DIR, fileName);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).send("❌ Error saving audio");
    res.send("✅ Audio chunk received");
  });
});

// ✅ عرض آخر صورة (لـ WebDisplay)
app.get("/stream/video", (req, res) => {
  const filePath = path.join(IMAGE_DIR, "latest.jpg");
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("No frame yet");
  }
  res.sendFile(path.resolve(filePath));
});

// ✅ (اختياري) API لإرجاع قائمة ملفات الصوت
app.get("/stream/audio", (req, res) => {
  fs.readdir(AUDIO_DIR, (err, files) => {
    if (err) return res.status(500).send("Error reading audio dir");
    res.json(files);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
