type TaskItemProps = {
  title: string;
};

function TaskItem({ title }: TaskItemProps) {
  return <li>{title}</li>;
}

export default TaskItem;