import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./page/LandingPage";
import Login from "./page/Login";
import Register from "./page/Register";
import SellBook from "./page/SellBook";
import BrowseBook from "./page/BrowseBook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

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
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

export default App;
