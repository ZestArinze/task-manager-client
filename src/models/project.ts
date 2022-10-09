import { Task } from './task';
import { User } from './user';

export type Project = {
  id: number;
  title: string;

  description: string;

  user_id: number;

  user: User;

  tasks?: Task[];
};
