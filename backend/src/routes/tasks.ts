
import express from "express";
import { pool } from "../db/pool";
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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

// Görevleri listele
router.get("/", async (_req, res) => {
  const result = await pool.query<Task>(
    "SELECT id, title, completed FROM tasks ORDER BY title, id"
  );

  res.status(200).json(result.rows);
});

// Yeni görev oluştur
router.post("/", async (req, res) => {
  const validation = validateCreateTask(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: validation.message,
    });
    return;
  }

  const result = await pool.query<Task>(
    `INSERT INTO tasks (title)
     VALUES ($1)
     RETURNING id, title, completed`,
    [validation.data.title]
  );

  res.status(201).json(result.rows[0]);
});

// Görev güncelle
router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    res.status(400).json({
      message: "Geçersiz görev ID'si.",
    });
    return;
  }

  const validation = validateUpdateTask(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: validation.message,
    });
    return;
  }

  const result = await pool.query<Task>(
    `UPDATE tasks
     SET title = COALESCE($2::text, title),
         completed = COALESCE($3::boolean, completed)
     WHERE id = $1
     RETURNING id, title, completed`,
    [
      id,
      validation.data.title ?? null,
      validation.data.completed ?? null,
    ]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      message: "Görev bulunamadı.",
    });
    return;
  }

  res.status(200).json(result.rows[0]);
});

// Görev sil
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    res.status(400).json({
      message: "Geçersiz görev ID'si.",
    });
    return;
  }

  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING id",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      message: "Görev bulunamadı.",
    });
    return;
  }

  res.status(204).send();
});

export default router;
