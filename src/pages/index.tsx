import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components";
import React from "react";
import { HomePage } from "./HomePage";
import { OrderPage } from "./OrderPage";
import { CourierPage } from "./CourierPage";
import { AdminPage } from "./AdminPage";
import { CONPage } from "./CONPage";

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
        path: "/admin",
        element: (
          <React.Suspense fallback="...Loading">
            <AdminPage />
          </React.Suspense>
        ),
      },
      {
        path: "/CON",
        element: (
          <React.Suspense fallback="...Loading">
            <CONPage />
          </React.Suspense>
        ),
      },
      {
        path: "/courier",
        element: (
          <React.Suspense fallback="...Loading">
            <CourierPage />
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
