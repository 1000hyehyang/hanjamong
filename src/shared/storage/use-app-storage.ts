import { useContext } from "react";
import {
  AppStorageContext,
  type AppStorageContextValue,
} from "./app-storage-context";

export function useAppStorage(): AppStorageContextValue {
  const context = useContext(AppStorageContext);
  if (!context) {
    throw new Error("useAppStorage must be used within AppStorageProvider");
  }
  return context;
}
