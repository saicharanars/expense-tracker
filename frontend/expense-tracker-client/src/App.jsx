import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authform from "./components/Authform";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import Productlist from "./components/Productlist";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Authform />,
    },
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "expenses",
          element: <Homepage />,
        },
        {
          path: "home",
          element: <Homepage />,
        },
        {
          path: "dashboard",
          element: <Productlist />,
        },
        {
          path: "profile",
          element: <Homepage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
