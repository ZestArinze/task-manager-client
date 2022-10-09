import { Project } from './project';

export type User = {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;

  projects?: Project[];
};
