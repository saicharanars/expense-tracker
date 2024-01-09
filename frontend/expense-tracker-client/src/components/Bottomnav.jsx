import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from 'react-router-dom';


export default function Bottomnav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{
        display:{md:"none"}
    }} >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction component={Link} to="/home"  label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction component={Link} to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction component={Link} to="/expenses" label="Expenses" icon={<AttachMoneyIcon />} />
        <BottomNavigationAction component={Link} to="/profile" label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Box>
  );
}
