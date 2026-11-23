
import express from "express";
import tasksRouter from "./routes/tasks";

const app = express();
const PORT = 3000;

// Gelen JSON verilerini okumak için
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

// Görev endpoint'lerini bağla
app.use("/api/tasks", tasksRouter);

// HTTP sunucusunu başlat
app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
