import { createBrowserRouter, RouterProvider } from "react-router-dom"
import BaseLayout from "./pages/BaseLayout";
import Login from "./pages/Login";
import { AuthProvider } from "./context/Auth";
import ProtectedPage from "./pages/ProtectedPage";
import PageA from "./pages/PageA";
import PageB from "./pages/PageB";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <BaseLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          element: <ProtectedPage />,
          children: [
            {
              path: "/pageA",
              element: <PageA />
            },
            {
              path: "/pageB",
              element: <PageB />
            },
          ]
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
