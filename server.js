import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// رابط Railway (إذا موجود)
const railwayDomain =
  process.env.RAILWAY_STATIC_URL ||
  process.env.RAILWAY_PUBLIC_DOMAIN ||
  `http://localhost:${port}`;

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// لاستقبال ملفات الصوت/الفيديو
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: `${railwayDomain}/uploads/${req.file.filename}` });
});

// تقديم الملفات بشكل عام
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// صفحة بسيطة للتجربة
app.get("/", (req, res) => {
  res.send(`<h2>🚀 Server is running!</h2>
            <p>Use this URL in Web Display:</p>
            <b>${railwayDomain}</b>`);
});

// بدء السيرفر
app.listen(port, () => {
  console.log(`🚀 Server running on: ${railwayDomain}`);
});
