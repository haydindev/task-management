
import express from "express";
import { randomUUID } from "node:crypto";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../validation/taskValidation";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const router = express.Router();

const tasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: true },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

// Görevleri listele
router.get("/", (_req, res) => {
  res.status(200).json(tasks);
});

// Yeni görev oluştur
router.post("/", (req, res) => {
  const result = validateCreateTask(req.body);

  if (!result.success) {
    res.status(400).json({
      message: result.message,
    });
    return;
  }

  const newTask: Task = {
    id: randomUUID(),
    title: result.data.title,
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Görev güncelle
router.patch("/:id", (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    res.status(404).json({
      message: "Görev bulunamadı.",
    });
    return;
  }

  const result = validateUpdateTask(req.body);

  if (!result.success) {
    res.status(400).json({
      message: result.message,
    });
    return;
  }

  if (result.data.title !== undefined) {
    task.title = result.data.title;
  }

  if (result.data.completed !== undefined) {
    task.completed = result.data.completed;
  }

  res.status(200).json(task);
});

// Görev sil
router.delete("/:id", (req, res) => {
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

export default router;
