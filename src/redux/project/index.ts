import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../models/project';

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
  },
});

export const { setProjects, removeProject, addProject } = projectSlice.actions;

export default projectSlice.reducer;
