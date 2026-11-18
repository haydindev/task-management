type TaskItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

function TaskItem({
  title,
  completed,
  onToggle,
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
    </li>
  );
}

export default TaskItem;