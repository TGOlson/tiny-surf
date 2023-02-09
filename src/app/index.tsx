import React from "react";
import ReactDOMClient from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import App from "./App";
import PageNotFound from "./PageNotFound";

import "./index.css";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: '/spot/:spotId',
        element: <App />
      },
    ],
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOMClient.createRoot(rootElement).render(
    <RouterProvider router={router} />
);
