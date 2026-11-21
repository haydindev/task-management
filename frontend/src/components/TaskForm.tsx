
import { useState } from "react";
import type { FormEvent } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Yeni görev yaz..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button type="submit">Görev Ekle</button>
    </form>
  );
}

export default TaskForm;
