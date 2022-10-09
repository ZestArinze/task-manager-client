import { combineReducers } from 'redux';

import project from './project';

const rootReducer = combineReducers({ project });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
