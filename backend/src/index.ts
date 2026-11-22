
import express from "express";
import { randomUUID } from "node:crypto";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const app = express();
const PORT = 3000;

// Gelen JSON verilerini okuyabilmek için
app.use(express.json());

const tasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: true },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

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

// Görevleri listele
app.get("/api/tasks", (_req, res) => {
  res.status(200).json(tasks);
});

// Yeni görev oluştur
app.post("/api/tasks", (req, res) => {
  const title: unknown = req.body?.title;

  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).json({
      message: "Geçerli bir görev başlığı gerekli.",
    });
    return;
  }

  const newTask: Task = {
    id: randomUUID(),
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Görev güncelle
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    res.status(404).json({
      message: "Görev bulunamadı.",
    });
    return;
  }

  const title: unknown = req.body?.title;
  const completed: unknown = req.body?.completed;

  if (title === undefined && completed === undefined) {
    res.status(400).json({
      message: "Güncellenecek alan belirtilmedi.",
    });
    return;
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    res.status(400).json({
      message: "Geçerli bir görev başlığı gerekli.",
    });
    return;
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    res.status(400).json({
      message: "completed alanı boolean olmalıdır.",
    });
    return;
  }

  if (typeof title === "string") {
    task.title = title.trim();
  }

  if (typeof completed === "boolean") {
    task.completed = completed;
  }

  res.status(200).json(task);
});

// Görev sil
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    res.status(404).json({
      message: "Görev bulunamadı.",
    });
    return;
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
