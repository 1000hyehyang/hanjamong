import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStorageProvider } from "../shared/storage/AppStorageProvider";

export function App() {
  return (
    <AppStorageProvider>
      <RouterProvider router={router} />
    </AppStorageProvider>
  );
}
