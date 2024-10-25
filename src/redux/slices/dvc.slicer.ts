import { createSlice } from "@reduxjs/toolkit";
import { DVCResponse } from "../../model/dvc_model";
const dvcDataSlicer = createSlice({
  name: "dvcData",
  initialState: {},
  reducers: {
    setDVC(state, action) {
      let dvc: DVCResponse[] = action.payload;
      state = { ...state, dvc };
      return state;
    },
  },
});

export const { setDVC } = dvcDataSlicer.actions;
export default dvcDataSlicer.reducer;
