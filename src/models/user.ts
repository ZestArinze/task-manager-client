import { Project } from './project';

export type User = {
  username: string;

  password: string;

  first_name: string;

  last_name: string;

  projects: Project[];
};
