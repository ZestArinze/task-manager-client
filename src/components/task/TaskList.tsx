import React from 'react';
import { Task } from '../../models/task';
import { TaskListItem } from './TaskListItem';

type Props = {
  tasks: Task[];
};

export const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <>
      {tasks.map((task, i) => (
        <ol key={i} className='list-group'>
          <TaskListItem task={task} />
        </ol>
      ))}
    </>
  );
};
