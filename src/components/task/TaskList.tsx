import React from 'react';
import { Task } from '../../models/task';
import { groupTasks } from '../../utils/task.utils';
import { TaskListItem } from './TaskListItem';

type Props = {
  tasks: Task[];
};

export const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <>
      <h4>TODO</h4>
      {groupTasks(tasks).pending.map((task, i) => (
        <ol key={i} className='list-group'>
          <TaskListItem task={task} />
        </ol>
      ))}

      <h4>Done</h4>
      {groupTasks(tasks).completed.map((task, i) => (
        <ol key={i} className='list-group'>
          <TaskListItem task={task} />
        </ol>
      ))}
    </>
  );
};
