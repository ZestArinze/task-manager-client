import { Task } from '../models/task';

type TaskGroup = {
  completed: Task[];
  pending: Task[];
};

export const groupTasks = (tasks: Task[]) => {
  const result: TaskGroup = {
    completed: [],
    pending: [],
  };

  tasks.forEach((task) => {
    if (task.completed_at) {
      result.completed.push(task);
    } else {
      result.pending.push(task);
    }
  });

  return result;
};
