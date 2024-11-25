import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../model/rooom_preference_model";
const userInfoSlicer = createSlice({
  name: "UserInfo",
  initialState: {},
  reducers: {
    ///User information list prefernce and rooms
    saveUserInfo(state, action) {
      let userInfo: UserInfo = action.payload;
      state = { ...state, userInfo };
      return state;
    },
  },
});

export const { saveUserInfo } = userInfoSlicer.actions;
export default userInfoSlicer.reducer;
