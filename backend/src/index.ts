
import express from "express";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;

// JSON verilerini oku
app.use(express.json());

// Ana sayfa
app.get("/", (_req, res) => {
  res.send("Task Management API çalışıyor!");
});

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "task-management-api",
  });
});

// Görev endpoint'leri
app.use("/api/tasks", tasksRouter);

// Tanımlanmamış endpoint'ler
app.use((_req, res) => {
  res.status(404).json({
    message: "Endpoint bulunamadı.",
  });
});

// Merkezi hata yönetimi
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
