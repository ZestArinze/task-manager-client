import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../models/task';

export type TaskState = {
  tasks: Array<Task>;
};

export const taskInitialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState: taskInitialState,
  reducers: {
    setTasks: (state, action: PayloadAction<TaskState>) => {
      return action.payload;
    },
    removeTask: (state, action: PayloadAction<number>) => {
      console.log(action);
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    addTask: (state, action: PayloadAction<Task>) => {
      console.log(action);
      state.tasks.push(action.payload);
    },
  },
});

export const {
  // setTasks, removeTask, addTask
} = taskSlice.actions;

export default taskSlice.reducer;
