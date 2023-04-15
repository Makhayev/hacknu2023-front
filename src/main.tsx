import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/nunito";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./pages";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
