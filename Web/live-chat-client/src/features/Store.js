import { configureStore } from "@reduxjs/toolkit";
import themeSliceReducer from "./ThemeSlice";
import RefreshSidebar from "./RefreshSidebar";

export const store = configureStore({
  reducer: {
    themeKey: themeSliceReducer,
    refreshKey: RefreshSidebar,
  },
});