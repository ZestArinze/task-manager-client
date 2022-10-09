import { Project } from './project';

export type Task = {
  id: number;
  title: string;
  description: string;
  completed_at: string;
  project_id: number;

  project: Project;
  created_at: string;
};
