import { createSlice } from "@reduxjs/toolkit";
import { Monitor } from "../../model/monitorCount_model";
const montorCountSlicer = createSlice({
  name: "MonitorCount",
  initialState: {},
  reducers: {
    ///Monitor count information
    saveMonitorCount(state, action) {
      let monitorCount: Monitor[] = action.payload;
      state = { ...state, monitorCount };
      return state;
    },
  },
});

export const { saveMonitorCount } = montorCountSlicer.actions;
export default montorCountSlicer.reducer;
