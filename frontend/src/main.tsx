import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AppProviders } from "./contexts/AppProviders";
import { Layout } from "./Layout";
import "./index.css";
import { Home } from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/bookshelves/:id", element: <div>Shelf Page</div> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster />
    </AppProviders>
  </StrictMode>,
);
