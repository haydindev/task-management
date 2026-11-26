
import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import type { Task } from "./types/task";
import "./App.css";

type TaskFilter = "all" | "active" | "completed";
type LoadStatus = "loading" | "success" | "error";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const [loadStatus, setLoadStatus] =
    useState<LoadStatus>("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [actionError, setActionError] = useState<string | null>(
    null
  );

  // GET: Görevleri API'den yükle
  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setLoadStatus("loading");
      setActionError(null);

      try {
        const response = await fetch("/api/tasks", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: Task[] = await response.json();

        if (!controller.signal.aborted) {
          setTasks(data);
          setLoadStatus("success");
        }
      } catch {
        if (!controller.signal.aborted) {
          setLoadStatus("error");
        }
      }
    }

    void loadTasks();

    return () => controller.abort();
  }, [retryCount]);

  // POST: Yeni görev oluştur
  async function addTask(title: string) {
    setActionError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const newTask: Task = await response.json();

      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch {
      setActionError("Görev eklenemedi.");
    }
  }

  // PATCH: Tamamlanma durumunu güncelle
  async function toggleTask(id: string) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    setActionError(null);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const updatedTask: Task = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch {
      setActionError("Görev durumu güncellenemedi.");
    }
  }

  // PATCH: Görev başlığını güncelle
  async function updateTask(id: string, newTitle: string) {
    setActionError(null);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const updatedTask: Task = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch {
      setActionError("Görev başlığı güncellenemedi.");
    }
  }

  // DELETE: Görevi PostgreSQL'den sil
  async function deleteTask(id: string) {
    setActionError(null);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== id)
      );
    } catch {
      setActionError("Görev silinemedi.");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <main className="task-app">
      <h1>My Task Manager</h1>
      <p>Görevlerini kolayca yönet.</p>
      <p>React görev yönetimi uygulamamı geliştiriyorum.</p>

      {loadStatus === "loading" && (
        <p role="status">Görevler yükleniyor...</p>
      )}

      {loadStatus === "error" && (
        <div>
          <p role="alert">Görevler API'den alınamadı.</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Yeniden Dene
          </button>
        </div>
      )}

      {loadStatus === "success" && (
        <>
          {actionError && <p role="alert">{actionError}</p>}

          <TaskForm onAddTask={addTask} />

          <div className="task-filters">
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Tümü
            </button>

            <button
              type="button"
              aria-pressed={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Aktif
            </button>

            <button
              type="button"
              aria-pressed={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Tamamlanan
            </button>
          </div>

          {filteredTasks.length === 0 && (
            <p>Görev bulunamadı.</p>
          )}

          <ul className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={(newTitle) =>
                  updateTask(task.id, newTitle)
                }
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
