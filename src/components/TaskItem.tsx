type TaskItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskItem({
  title,
  completed,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
        />
        {completed ? <s>{title}</s> : title}
      </label>

      <button type="button" onClick={onDelete}>
        Sil
      </button>
    </li>
  );
}

export default TaskItem;