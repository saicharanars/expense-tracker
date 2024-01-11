import React, { useEffect, useContext, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpenseslice,
  removeeditexpensedata,
  setupdatebutton,
} from "../redux/Expensereducer";
import axios from "axios";
import Typography from "@mui/material/Typography";

const Addproduct = () => {
  const dispatch = useDispatch();
  const expenseInputref = useRef();
  const amountInputref = useRef("");
  const expensetypeInputref = useRef();

  const updatebutton = useSelector((state) => state.expense.updatebutton);
  const [validation, setValidation] = useState({});
  const url = "https://expense-tracker-mzom.onrender.com/";
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.expense.items);
  const editexpensedata = useSelector((state) => state.expense.editexpensedata);
  const [category, setCategory] = useState("");
  const categories = [
    "shopping",
    "grocery",
    "transport",
    "housing",
    "food & drink",
  ];

  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

 const handlesubmit = (e) => {
    e.preventDefault();
    const expense = expenseInputref.current.value;
    const amount = amountInputref.current.value;
    const expensetype = expensetypeInputref.current.value;
    const body = {
      expenseamount: amount,
      category: expensetype,
      expensetype: expense,
    };
    let result;

    if (updatebutton) {
      console.log(editexpensedata);
      const updateitem = {
        expensetype: body.expensetype,
        expenseamount: Number(body.expenseamount),
        expensecategory: body.category,
        prevamount: editexpensedata.previousamount,
      };
      const editexpense = async (body) => {
        try {
          console.log(updateitem);
          const res = await axios.put(
            `${url}edit-expense/${editexpensedata._id}`,
            updateitem,
            {
              headers: { Authorization: token },
            }
          );
          const status = res.status;
          console.log(res, "vgvbvg");
          if (status == 200) {
            const updatedItems = items.map((item) => {
              if (item._id === editexpensedata._id) {
                console.log("cnj");
                // Replace the item with id 2
                const updateditemafte = {
                  ...item,
                  expensetype: updateitem.expensetype,
                  expenseamount: Number(body.expenseamount),
                  category: updateitem.expensecategory,
                };
                return updateditemafte; // You can replace this with your new object
              }
              return item; // Keep other items unchanged
            });
            result = { message: res.data.message, validation: "success" };
            setValidation(result);
            setTimeout(() => {
              setValidation(null);
            }, 2000);
          }
        } catch (error) {
          console.log(error);
          result = {
            message: error.response.data.message,
            validation: "error",
          };
          setValidation(result);
          setTimeout(() => {
            setValidation(null);
            dispatch(removeeditexpensedata());
            dispatch(setupdatebutton());
          }, 5000);
        }
      };
      editexpense(body);
    } else {
      const addExpense = async (body) => {
        try {
          const res = await axios.post(`${url}add-expense`, body, {
            headers: { Authorization: token },
          });

          if (res.status === 200) {
            const loadedExpItem = {
              _id: res.data.expenses._id,
              expenseamount: res.data.expenses.expenseamount,
              category: res.data.expenses.category,
              expensetype: res.data.expenses.expensetype,
            };
            console.log(loadedExpItem);
            dispatch(addExpenseslice(loadedExpItem));
            result = { message: res.data.message, validation: "success" };
            setValidation(result);
            setTimeout(() => {
              setValidation(null);
            }, 2000);
          }
        } catch (error) {
          // Handle error appropriately
          console.log(error);
          const result = {
            message: error.response.data.message,
            validation: "warning",
          };
          setValidation(result);
          setTimeout(() => {
            setValidation(null);
          }, 2000);
        }
      };
      addExpense(body);
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      {updatebutton && (
        <Grid item sx={{ padding: 1, fontSize: 8 }}>
          <Typography variant="subtitle2" gutterBottom>
            you are now editing {editexpensedata.prevtype}{" "}
            {editexpensedata.prevcategory} {editexpensedata.previousamount}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} sx={{ padding: 1 }}>
        <TextField
          size="small"
          label="Expense"
          fullWidth
          inputRef={expenseInputref}
        />
      </Grid>
      <Stack direction={{ sm: "column", md: "row" }}>
        <Grid item md={6} xs={12} sx={{ padding: 1 }}>
          <TextField
            size="small"
            label="expense amount"
            type="number"
            fullWidth
            inputRef={amountInputref}
          />
        </Grid>
        <Grid item md={6} xs={12} sx={{ padding: 1 }}>
          <Select
            size="small"
            value={category}
            label="Category"
            onChange={handleCategory}
            fullWidth
            inputRef={expensetypeInputref}
          >
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Stack>

      {updatebutton && (
        <Grid item sx={{ padding: 1 }}>
          <Button type="submit" variant="outlined" fullWidth>
            Update
          </Button>
        </Grid>
      )}

      {!updatebutton && (
        <Grid item sx={{ padding: 1 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#FF9292",
              "&:hover": {
                backgroundColor: "#FF9292",
              },
            }}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      )}

      {validation && validation.validation && (
        <Grid item sx={{ padding: 2 }}>
          <Alert severity={validation.validation}>{validation.message}</Alert>
        </Grid>
      )}
    </form>
  );
};

export default Addproduct;
