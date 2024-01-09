import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/Authreducer";
export default function Mobilenav() {
  const dispatch = useDispatch()

    const handlelogout = (e)=>{
        // e.preventDefault();
        // console.log("ffbh")
        dispatch(authActions.logout())
        window.location.href = "/login"
    }
  return (
    <Box sx={{ flexGrow: 1,display: { xs: 'block', md: 'none' } }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense
          </Typography>
          <Button onClick={(event) => handlelogout()} color="inherit">logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
