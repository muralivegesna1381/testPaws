import {createSlice} from '@reduxjs/toolkit';
import {NavigationStacks} from '../../navigation/types';
export type Current_Navigation_Stack = {
  stackName: NavigationStacks;
};

const navigationStackSlice = createSlice({
  name: 'navigationStack',
  initialState: {stackName: 'Auth'},
  reducers: {
    updateStack(state, action) {
      state.stackName = action.payload.stackName;
    },
  },
});

export const {updateStack} = navigationStackSlice.actions;
export default navigationStackSlice.reducer;
