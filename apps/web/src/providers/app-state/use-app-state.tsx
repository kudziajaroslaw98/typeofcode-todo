import { useContext } from "react";
import { AppState } from "./app-state-context";

export const useAppState = () => {
  const context = useContext(AppState);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
};
