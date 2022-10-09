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
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },

    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },

    updateProject: (state, action: PayloadAction<Project>) => {
      const projectIndex = state.projects.findIndex(
        (p) => p.id == action.payload.id
      );

      state.projects[projectIndex] = action.payload;
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

    removeTask: (
      state,
      action: PayloadAction<{ projectId: number; taskId: number }>
    ) => {
      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.projectId
      );

      if (projectIndex >= 0) {
        state.projects[projectIndex].tasks = state.projects[
          projectIndex
        ].tasks?.filter((task) => task.id !== action.payload.taskId);
      }
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.project_id
      );

      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.project_id
      );

      const taskIndex = state.projects[projectIndex].tasks?.findIndex(
        (p) => p.id === action.payload.id
      );

      if (taskIndex && project?.tasks) {
        project.tasks[taskIndex] = action.payload;
      }
    },
  },
});

export const {
  setProjects,
  removeProject,
  addProject,
  updateProject,
  addTask,
  removeTask,
  updateTask,
} = projectSlice.actions;

export default projectSlice.reducer;
