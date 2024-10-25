import {createSlice} from '@reduxjs/toolkit';

export type Todo_Item = {
  id: string;
  text: string;
  completed: boolean;
};

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state: Todo_Item[], action) {
      state.push({
        id: action.payload.id,
        text: action.payload.title,
        completed: false,
      });
    },
    updateTodo(state, action) {
      const todo: Todo_Item = state.find(
        (todo: Todo_Item) => todo.id === action.payload.id,
      )!;
      todo.text = action.payload.title;
    },
    todoToggled(state, action) {
      const todo: Todo_Item = state.find(
        (todo: Todo_Item) => todo.id === action.payload.id,
      )!;
      todo.completed = !todo.completed;
    },
    deleteTodo(state, action) {
      return state.filter((todo: Todo_Item) => todo.id !== action.payload.id);
    },
  },
});

export const {todoAdded, updateTodo, todoToggled, deleteTodo} =
  todosSlice.actions;
export default todosSlice.reducer;
