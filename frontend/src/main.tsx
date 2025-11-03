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
import { BookPage } from "./pages/BookPage";
import { Home } from "./pages/Home";
import { MyBookshelf } from "./pages/MyBookshelf";
import { PublicBookshelf } from "./pages/PublicBookshelf";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/bookshelves/:publicId", element: <PublicBookshelf /> },
      { path: "/my/bookshelf", element: <MyBookshelf /> },
      { path: "/books/:bookId", element: <BookPage mode="view" /> },
      { path: "/books/:bookId/edit", element: <BookPage mode="edit" /> },
      { path: "/books/new", element: <BookPage mode="create" /> },
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
