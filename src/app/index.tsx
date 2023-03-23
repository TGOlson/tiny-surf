import React from "react";
import ReactDOMClient from 'react-dom/client';
import {
  createHashRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';

import Root from "./pages/Root";
import SpotExplorer from "./pages/SpotExplorer";
import ErrorPage from "./pages/ErrorPage";

// I don't really love the public-sans font,
// just let joy-ui fallback to its defaults
// import '@fontsource/public-sans';
import "./index.css";

import store from './store';

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: null,
        // no real index page, start every at tourmaline and let them go from there!
        loader: () => redirect('/s/old-mans-at-tourmaline-88c4'),
      },
      {
        path: "/s/:slug",
        element: <SpotExplorer />,
      },
      {
        path: "/s/:slug/experiments",
        element: <SpotExplorer experiments />,
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
