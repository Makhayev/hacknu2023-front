import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components";
import React from "react";
import { HomePage } from "./HomePage";
import { OrderPage } from "./OrderPage";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <React.Suspense fallback="...Loading">
            <HomePage />
          </React.Suspense>
        ),
      },
      {
        path: "/order/:id",
        element: (
          <React.Suspense fallback="...Loading">
            <OrderPage />
          </React.Suspense>
        ),
      },
    ],
  },
]);
