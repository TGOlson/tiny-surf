import React from "react";
import ReactDOMClient from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';

import Root from "./pages/Root";
import SpotExplorer from "./pages/SpotExplorer";
import ErrorPage from "./pages/ErrorPage";

import "./index.css";

import store from './store';
import { regionLoader, spotLoader } from "./loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "r/:regionId",
        loader: regionLoader
      },
      {
        path: "r/:regionId/s/:spotId",
        element: <SpotExplorer />,
        loader: spotLoader
      },
    ],
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOMClient.createRoot(rootElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
