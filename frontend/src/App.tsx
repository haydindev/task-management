
import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import type { Task } from "./types/task";
import "./App.css";

type TaskFilter = "all" | "active" | "completed";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET: Görevleri API'den yükle
  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
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
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Görevler API'den alınamadı.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTasks();

    return () => controller.abort();
  }, []);

  // POST: Yeni görevi PostgreSQL'e kaydet
  async function addTask(title: string) {
    setError(null);

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
      setError("Görev eklenemedi.");
    }
  }

  // PATCH ve DELETE henüz yerel state üzerinde çalışıyor
  function toggleTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  }

  function updateTask(id: string, newTitle: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, title: newTitle }
          : task
      )
    );
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

      {loading && <p>Görevler yükleniyor...</p>}
      {error && <p role="alert">{error}</p>}

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

      {!loading && !error && filteredTasks.length === 0 && (
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
            onEdit={(newTitle) => updateTask(task.id, newTitle)}
          />
        ))}
      </ul>
    </main>
  );
}

export default App;
