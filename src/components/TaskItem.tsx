import { useState } from "react";
import type { FormEvent } from "react";

type TaskItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
};

function TaskItem({
  title,
  completed,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  function handleEdit() {
    setEditedTitle(title);
    setIsEditing(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) return;

    onEdit(trimmedTitle);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedTitle(title);
    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            type="text"
            aria-label="Görev başlığı"
            value={editedTitle}
            onChange={(event) =>
              setEditedTitle(event.target.value)
            }
          />

          <button type="submit">Kaydet</button>

          <button type="button" onClick={handleCancel}>
            İptal
          </button>
        </form>
      ) : (
        <>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={onToggle}
            />
            {completed ? <s>{title}</s> : title}
          </label>

          <button type="button" onClick={handleEdit}>
            Düzenle
          </button>

          <button type="button" onClick={onDelete}>
            Sil
          </button>
        </>
      )}
    </li>
  );
}

export default TaskItem;