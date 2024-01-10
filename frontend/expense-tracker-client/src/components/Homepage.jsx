import { Grid, Paper, Container, Box, Typography, Card } from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import Latestexpenselist from "./Latestexpenseslist";
import Addproduct from "./Addproduct";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import LinearProgress from "@mui/material/LinearProgress";

const Homepage = () => {
  const categories = [
    ["shopping",30],
    ,["grocery",60],
    ["transport",45],
    ["housing",75],
    ["food & drink",55]
  ];
  return (
    <Container
      sx={{
        bgcolor: "inherit",
        minHeight: "100vh",
      }}
      maxWidth="lg"
    >
      <Paper
        sx={{
          borderRadius: 5,
        }}
      >
        <Container 
          sx={{
            alignContent: "space-between",
            display: "flex",
            alignItems: "center",
            p: {md:2,xs:0},
            overflow: "auto",
            flexDirection: { xs: "column", md: "row" },
          }}
          maxWidth="lg"
        >
          <Box
            sx={{
              
              p: {md:2,xs:0,},
              width: {xs:"100%",md:"60%"}
            }}
          >
            <Stack direction="column">
                <Box sx={{
                    p: {md:1,xs:2}
                }}>
                <Typography variant="h4" component="h5">
                Expenses
              </Typography>
                </Box>
              <Box sx={{
                    p: {md:1,xs:2}
                }}>
              <Typography variant="h6" component="h6">
                Latest
              </Typography>
              </Box>
              <Box sx={{
                    p: {md:1,xs:0}
                }}>

              <Latestexpenselist />
              </Box>
              
            </Stack>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F9FAFC",
              height: "90%",
              overflow: "hidden",
              display:"flex",
              flexDirection:"column",
              p: {xs:0,md:1},
              borderRadius: 5,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#F9FAFC",
                display:"flex",
                flexDirection:"column",
                alignItems:"flex-start",
                alignContent:"center",
                p: 1,
                borderRadius: 5,
              }}
            >
              <Typography variant="h6" component="h6">
                Add Expense
              </Typography>
              <Addproduct />
            </Box>

            <Typography variant="h6" component="h6">
              Where Does your money go?
            </Typography>
            <Card
              sx={{
                p: 2,
              }}
            >
              {categories.map((item) => (
                <Box sx={{
                    p:1
                }} key={item}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Typography variant="body1" component="body1">
                      {item[0]}
                    </Typography>
                    <Typography variant="body1" component="body1">
                      ₹ 250
                    </Typography>
                  </Stack>
                  <LinearProgress color="success" variant="determinate" value={item[1]} />
                </Box >
              ))}
            </Card>
          </Box>
        </Container>
      </Paper>
    </Container>
  );
};

export default Homepage;
