// Format date for display

export const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

//  Check if task is overdue
export const isOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
};
