import React, { useEffect, useContext, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import AuthContext from "../store/Authcontext";

const Addproduct = () => {
  const expenseInputref = useRef();
  const amountInputref = useRef();
  const expensetypeInputref = useRef();
  const authctx = useContext(AuthContext);
  const validation = authctx.addProductstatus;
  const editExpenseDatajson = authctx.editExpensedatajson;
  const updatebutton = authctx.updatebutton;

  useEffect(() => {
    console.log(authctx);
    if (editExpenseDatajson) {
      // Populate the form fields when editExpenseData is available
      expenseInputref.current.value = editExpenseDatajson.expensecategory || "";
      amountInputref.current.value = editExpenseDatajson.expenseamount || "";
      expensetypeInputref.current.value = editExpenseDatajson.expensetype || "";
    }
  }, [editExpenseDatajson]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const expense = expenseInputref.current.value;
    const amount = amountInputref.current.value;
    const expensetype = expensetypeInputref.current.value;
    const body = {
      expenseamount: amount,
      category: expense,
      expensetype: expensetype,
    };
    console.log(updatebutton, "hc");
    if (!updatebutton) {
      console.log(authctx, "hhf");
      const res = authctx.addExpense(expense, amount, expensetype);
      console.log(authctx, "hhf", res);
    } else {
      console.log(expense, amount, expensetype);
      const res = authctx.editExpense(expense, amount, expensetype);
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <Grid item sx={{ padding: 2 }}>
        <TextField label="Expense" fullWidth inputRef={expenseInputref} />
      </Grid>

      <Grid item sx={{ padding: 2 }}>
        <TextField
          label="expense amount"
          type="number"
          fullWidth
          inputRef={amountInputref}
        />
      </Grid>

      <Grid item sx={{ padding: 2 }}>
        <TextField
          label="expensetype"
          variant="outlined"
          fullWidth
          inputRef={expensetypeInputref}
        />
      </Grid>

      {/* {addproductProgress && <p>Sending Request...</p>}
          {productSuccess && <Alert severity="success">{signupSuccess}</Alert>} */}
      {updatebutton && (
        <Grid item sx={{ padding: 2 }}>
          <Button type="submit" variant="contained" fullWidth>
            Update
          </Button>
        </Grid>
      )}

      {!updatebutton && (
        <Grid item sx={{ padding: 2 }}>
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Grid>
      )}

      <Grid item sx={{ padding: 2 }}>
        {validation && (
          <Alert severity={validation.validation}>{validation.message}</Alert>
        )}
      </Grid>
    </form>
  );
};

export default Addproduct;
