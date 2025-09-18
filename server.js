import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

// Endpoint لاستقبال الصور (Frames)
app.post("/upload/frame", upload.single("frame"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const newPath = path.join("uploads", `${Date.now()}.png`);
  fs.renameSync(file.path, newPath);

  console.log("📷 Frame received:", newPath);
  res.json({ status: "ok", url: `/frames/${path.basename(newPath)}` });
});

// Endpoint لاستقبال الصوت
app.post("/upload/audio", upload.single("audio"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No audio uploaded");

  const newPath = path.join("uploads", `${Date.now()}.wav`);
  fs.renameSync(file.path, newPath);

  console.log("🎤 Audio received:", newPath);
  res.json({ status: "ok", url: `/audio/${path.basename(newPath)}` });
});

// عرض الملفات بشكل عام
app.use("/frames", express.static("uploads"));
app.use("/audio", express.static("uploads"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://${railwayDomain}`);
});
