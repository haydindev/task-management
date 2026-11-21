
import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import type { Task } from "./types/task";
import "./App.css";

type TaskFilter = "all" | "active" | "completed";

const initialTasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: true },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");

  function addTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

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
