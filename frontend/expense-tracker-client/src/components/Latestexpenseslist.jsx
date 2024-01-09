import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import WorkIcon from "@mui/icons-material/Work";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalGroceryStore from "@mui/icons-material/LocalGroceryStore";
export default function Latestexpenselist() {
  const token = useSelector((state) => state.auth.token);
  const url = "http://localhost:4000/";
  const [items, setItems] = useState();

  const expense = async (offset, limit) => {
    console.log(offset, limit);
    try {
      const response = await axios.get(
        `${url}allexpenses?page=${offset}&rows=${limit}`,
        { headers: { Authorization: token } }
      );
      const data = response.data.expenses;
      console.log(data);
      const date = data.map((item)=>{
        const createdAtDate = new Date(item.createdAt);
        const datetostring = createdAtDate.toDateString()
        item.createdAt = datetostring
        if(item.category == "food & drink"){
            item.category = "food";
        }
      })
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect( () => {
    const fetchData = async () => {
      const expenseItems = await expense(1, 5);
      setItems(expenseItems);
    };

    fetchData();
  }, []);
  const categoryIcons = {
    shopping: { icon: <ShoppingBasketIcon />, color: "#32A7E2" },
    housing: { icon: <HomeWorkIcon />, color: "#FF9BB3" },
    food: { icon: <FoodBankIcon />, color: "#DC3434" },
    transport: { icon: <DirectionsBusIcon />, color: "#B548C6" },
    grocery: { icon: <LocalGroceryStore />, color: "#32A7E2" }
  };
  

  return (
    <List
      sx={{
        width: "100%",
        p: { md: 1, xs: 0 },
        bgcolor: "background.paper",
        fontSize: 4,
      }}
    >
      {items &&(items.map((item) => (
        
      <ListItem
        key={item._id} // don't forget to add a unique key
        secondaryAction={
          <Typography edge="end" variant="body1" component="body1">
            ₹ {item.expenseamount} 
          </Typography>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{

              bgcolor:categoryIcons[item.category].color
          }}
          >
          {categoryIcons[item.category].icon || <WorkIcon fontSize="small" />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.expensetype} secondary={item.createdAt} />
      </ListItem>
    )))}
    </List>
  );
}
