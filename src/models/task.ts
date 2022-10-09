import { Project } from './project';

export type Task = {
  id: number;

  title: string;

  description: string;

  completed_at: Date;

  project_id: number;

  project: Project;
};
