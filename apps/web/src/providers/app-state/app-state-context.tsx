import { createContext } from "react";
import type { AppStateType } from "./app-state";

export const AppState = createContext<AppStateType>({
  tasks: [],
  taskFilters: {},
  toggleDone: () => {},
  toggleTaskSession: () => {},
  newTask: () => {},
  updateTask: () => {},
  updateFilters: () => {},
  selected: [],
  setSelected: () => {},
  tasksLoading: false,
  removeSelected: () => {},
  removeAll: () => {},
});
