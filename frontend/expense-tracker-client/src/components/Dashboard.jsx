import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import store from "../redux/store";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Mobilenav from "./Mobilenav";
import Bottomnav from "./Bottomnav";

const Dashboard = () => {
  const stored = store.getState();
  const login = stored.auth.isLoggedIn;
  console.log(login);
  useEffect(() => {
    if (!login) {
      window.location.href = "/login";
    }
  }, [login]);
  return (
    <Grid
      container
      sx={{
        backgroundColor: "#Fbdede",
        width: "100vw",
        minHeight: "100vh",
      }}
      rowSpacing={1}
      columnSpacing={2}
      width={1}
    >

      <Grid sx={{ p: 2,display: { md: 'block', xs: 'none' } }} item xs={12} md={2}>
        <Sidebar />
      </Grid>
      <Grid sx={{ p: {md:1,xs:0},display:{xs:"block",md:"none"} }} item xs={12} >
          <Mobilenav />
      </Grid>
      <Grid sx={{ p: {md:1,xs:0} }} item xs={12} md={10}>
       

          <Outlet />
          <Bottomnav/>
      
      </Grid>
      
    </Grid>
  );
};

export default Dashboard;
