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
import HomePage from "./pages/HomePage";

import "./index.css";

import store from './store';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/s/:slug",
        element: <SpotExplorer />,
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
