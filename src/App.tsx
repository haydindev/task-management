
import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import type { Task } from "./types/task";

const initialTasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: true },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
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

  return (
    <main>
      <h1>My Task Manager</h1>
      <p>Görevlerini kolayca yönet.</p>
      <p>React görev yönetimi uygulamamı geliştiriyorum.</p>

      <TaskForm onAddTask={addTask} />

      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            completed={task.completed}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </ul>
    </main>
  );
}

export default App;
