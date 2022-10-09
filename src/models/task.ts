import { Project } from './project';

export type Task = {
  title: string;

  description: string;

  completed_at: Date;

  project_id: number;

  project: Project;
};
