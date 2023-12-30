import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authform from "./components/Authform";
import Dashboard from "./components/Dashboard";
function App() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Authform />,
      },
      {
        path: "/dashboard",
        element: <Dashboard/>,
      },

    ]);
  
    return <RouterProvider router={router} />;
  }
  

export default App;
