import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/Authreducer";

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const dispatch = useDispatch()
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    console.log(event.target.value);
  };
const handlelogout = (e)=>{
    // e.preventDefault();
    console.log("ffbh")
    dispatch(authActions.logout())
    window.location.href = "/login"
}
  return (
    <List
      sx={{
        width: "100%",
        height: "90vh",
        maxWidth: 360,
        bgcolor: "inherit",
        mt: 4,
      }}
      component="nav"
    >
      {[0, 1, 2, 3].map((index) => (
        // <Link to={`/${["home", "dashboard", "expenses", "profile"][index]}`} key={index}>
          <ListItemButton
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
            component={Link}
            to={`/${["home", "dashboard", "expenses", "profile"][index]}`} key={index}
            sx={{
              mt: 4,
              px: 5,
              color: selectedIndex === index ? "#471C1C" : "#DD7A7A",
              textDecoration:"none"
            }}
          >
            <ListItemText
              sx={{
                fontWeight: "bold",
                textDecoration:"none"
              }}
              primary={["Home", "Dashboard", "Expenses", "Profile"][index]}
            />
          </ListItemButton>
        // </Link>
      ))}
      <ListItemButton
            onClick={(event) => handlelogout()}
            sx={{
              mt: 4,
              px: 5,
              color:  "#DD7A7A",
              textDecoration:"none"
            }}
          >
            <ListItemText
              sx={{
                fontWeight: "bold",
                textDecoration:"none"
              }}
              primary="Logout"
            />
          </ListItemButton>
    </List>
  );
};

export default Sidebar;
