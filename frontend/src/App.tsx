import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./page/LandingPage";
import Login from "./page/Login";
import Register from "./page/Register";
import SellBook from "./page/SellBook";
import BrowseBook from "./page/BrowseBook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import GeoLocationProvider from "./context/GeoLocationProvider";
import BookDetailsPage from "./page/BookDetailsPage";

import BookMark from "./page/BookMark";
import { MyBookTable } from "./components/MyBookTable";
import MyBook from "./page/MyBook";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/sell",
        element: <SellBook />,
      },
      {
        path: "/books",
        element: <BrowseBook />,
      },
      {
        path: "/books/:bookId",
        element: <BookDetailsPage />,
      },
      {
        path: "/mybooks",
        element: <MyBook />,
      },
      {
        path: "/bookMarks",
        element: <BookMark />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <GeoLocationProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </AuthProvider>
        </GeoLocationProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
