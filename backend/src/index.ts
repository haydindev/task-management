
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Task Management API çalışıyor!");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "task-management-api",
  });
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
