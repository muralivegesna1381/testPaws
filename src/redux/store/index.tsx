import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { Todo_Item } from '../slices/todo-slicer';
import navigationStackReducer, {
  Current_Navigation_Stack,
} from '../slices/login.slicer';

import userSlicet from '../slices/user.slicer';
import userInfoSlicer from '../slices/userInfo.slicer';
import monitorCountsSlicer from '../slices/monitorCounts.slicer';
import dvcSlicer from '../slices/dvc.slicer';

export type Root_State = {
  todos: Todo_Item[];
  currentStack: Current_Navigation_Stack;
  userData: any;
};
export const store = configureStore({
  reducer: {
    todos: todosReducer,
    currentStack: navigationStackReducer,
    userData: userSlicet,
    userInfo: userInfoSlicer,
    monitorCount: monitorCountsSlicer,
    dvcData: dvcSlicer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
