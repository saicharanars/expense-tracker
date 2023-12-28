import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import axios from "axios";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
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
