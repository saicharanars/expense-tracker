import React from "react";
import Grid from "@mui/material/Grid";

import Addproduct from "./Addproduct";
import Productlist from "./Productlist";

const Dashboard = () => {
  return (
    <Grid container rowSpacing={1} columnSpacing={2} width={1}>
      <Grid sx={{ p: 2 }} item xs={12} md={4}>
        <Addproduct />
      </Grid>
      <Grid sx={{ p: 2 }} item xs={12} md={8}>
        <Productlist />
      </Grid>

      {/* {error && <Alert severity="warning">{error}</Alert>} */}
    </Grid>
  );
};

export default Dashboard;
