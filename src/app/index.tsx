import React from "react";
import ReactDOMClient from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import SpotList from "./components/SpotList";
import ErrorPage from "./ErrorPage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "s/:spotId",
        element: <SpotList />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOMClient.createRoot(rootElement).render(
  <RouterProvider router={router} />
);
