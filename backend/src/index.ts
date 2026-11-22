
import express from "express";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const app = express();
const PORT = 3000;

const tasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: true },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

app.get("/", (_req, res) => {
  res.send("Task Management API çalışıyor!");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "task-management-api",
  });
});

app.get("/api/tasks", (_req, res) => {
  res.status(200).json(tasks);
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
