import TaskItem from "./components/TaskItem";
import type { Task } from "./types/task";

const tasks: Task[] = [
  { id: "1", title: "React öğren", completed: true },
  { id: "2", title: "TypeScript çalış", completed: false },
  { id: "3", title: "Task Manager geliştir", completed: false },
  { id: "4", title: "Git ve GitHub öğren", completed: false },
];

function App() {
  return (
    <main>
      <h1>My Task Manager</h1>
      <p>Görevlerini kolayca yönet.</p>
      <p>React görev yönetimi uygulamamı geliştiriyorum.</p>

      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} title={task.title} />
        ))}
      </ul>
    </main>
  );
}

export default App;

