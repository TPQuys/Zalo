import { createSlice } from "@reduxjs/toolkit";

export const RefreshSidebar = createSlice({
  name: "RefreshSidebar",
  initialState: true,
  reducers: {
    RefreshSidebarFun: (state) => {
      console.log("Refreshing sidebar from Redux");
      return (state = !state);
    },
  },
});

export const { RefreshSidebarFun } = RefreshSidebar.actions;
export default RefreshSidebar.reducer;