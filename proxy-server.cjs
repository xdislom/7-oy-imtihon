// Video proxy + local storage server
// Ishlatish: node proxy-server.cjs

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const VIDEO_DIR = path.join(__dirname, "proxy-videos");

// proxy-videos papkasini yaratamiz
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

function setCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, x-filename, x-original-name");
}

const server = http.createServer((req, res) => {
  setCORS(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;

  // ✅ POST /save-video — videoni lokal saqlaymiz
  if (req.method === "POST" && pathname === "/save-video") {
    const originalName = req.headers["x-original-name"] || req.headers["x-filename"] || `video-${Date.now()}.mp4`;
    // Xavfsiz fayl nomi yaratamiz
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const savedName = `${timestamp}_${safeName}`;
    const filePath = path.join(VIDEO_DIR, savedName);

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log(`✅ Video saqlandi: ${savedName}`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        localUrl: `http://localhost:${PORT}/video-file/${savedName}`,
        savedName
      }));
    });

    writeStream.on("error", (err) => {
      console.error("Saqlashda xato:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  // ✅ GET /video-file/:filename — lokal videoni stream qilamiz
  if (req.method === "GET" && pathname.startsWith("/video-file/")) {
    const fileName = decodeURIComponent(pathname.slice("/video-file/".length));
    const filePath = path.join(VIDEO_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Video topilmadi");
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const rangeHeader = req.headers.range;

    if (rangeHeader) {
      // Range request — katta videolar uchun
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
        "Access-Control-Allow-Origin": "*",
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      });
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // ✅ GET /list — saqlangan videolar ro'yxati
  if (req.method === "GET" && pathname === "/list") {
    const files = fs.readdirSync(VIDEO_DIR).map((f) => ({
      name: f,
      url: `http://localhost:${PORT}/video-file/${f}`,
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(files));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🚀 Video server ishga tushdi: http://localhost:${PORT}`);
  console.log(`📁 Videolar saqlanadigan papka: ${VIDEO_DIR}`);
  console.log(`\nEndpointlar:`);
  console.log(`  POST /save-video        — videoni saqlash`);
  console.log(`  GET  /video-file/:name  — videoni ko'rish`);
  console.log(`  GET  /list              — barcha videolar\n`);
});
