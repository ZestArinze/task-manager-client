import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../models/project';
import { Task } from '../../models/task';

export type ProjectState = {
  projects: Array<Project>;
};

export const projectInitialState: ProjectState = {
  projects: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState: projectInitialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectState>) => {
      return action.payload;
    },
    removeProject: (state, action: PayloadAction<number>) => {
      console.log(action);

      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
    addProject: (state, action: PayloadAction<Project>) => {
      console.log(action);
      state.projects.push(action.payload);
    },
    removeTask: (
      state,
      action: PayloadAction<{ projectId: number; taskId: number }>
    ) => {
      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.projectId
      );
      if (projectIndex >= 0) {
        const project = state.projects[projectIndex];
        if (project?.tasks) {
          const taskIndex = project.tasks.findIndex(
            (task) => task.id === action.payload.taskId
          );

          if (taskIndex >= 0) {
            state.projects[projectIndex].tasks?.splice(taskIndex, 1);
          }
        }
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const projectIndex = state.projects.findIndex(
        (p) => p.id == action.payload.project_id
      );
      if (projectIndex >= 0) {
        if (state.projects[projectIndex].tasks) {
          state.projects[projectIndex].tasks?.push(action.payload);
        } else {
          state.projects[projectIndex].tasks = [action.payload];
        }
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const projectIndex = state.projects.findIndex(
        (p) => p.id == action.payload.project_id
      );
      if (projectIndex >= 0) {
        if (state.projects[projectIndex].tasks) {
          const taskIndex = state.projects[projectIndex].tasks?.findIndex(
            (p) => p.id == action.payload.project_id
          );
          if (taskIndex !== undefined && taskIndex >= 0) {
            const updatedProejectTasks =
              state.projects[projectIndex].tasks ?? [];
            updatedProejectTasks.splice(taskIndex, 1, action.payload);

            state.projects[projectIndex].tasks = updatedProejectTasks;
          }
        }
      }
    },
  },
});

export const {
  setProjects,
  removeProject,
  addProject,
  addTask,
  removeTask,
  updateTask,
} = projectSlice.actions;

export default projectSlice.reducer;
