import { createSlice } from "@reduxjs/toolkit";
const userSlicer = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    saveUserData(state, action) {
      let userInfo = action.payload;
      state = { ...state, userInfo };
      return state;
    },
  },
});

export const { saveUserData } = userSlicer.actions;
export default userSlicer.reducer;
