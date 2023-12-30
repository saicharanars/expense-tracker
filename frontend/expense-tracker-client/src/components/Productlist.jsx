import React, { useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AuthContext from "../store/Authcontext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Productlist = () => {
  const authctx = useContext(AuthContext);
  const { deleteStatus, expenseitems, deleteExpense, editExpensedata } =
    authctx;

  const edit = (id, prevamount, prevcategory, prevtype) => {
    console.log(
      id,
      prevamount,
      prevcategory,
      prevtype,
      "gfvub",
      authctx.editExpensedata
    );
    editExpensedata(id, prevamount, prevcategory, prevtype);
  };

  const deleteExpenseHandler = (id) => {
    deleteExpense(id);
  };

  return (
    <>
      <TableContainer component={Paper}>
        {deleteStatus && (
          <Snackbar open={open} autoHideDuration={2000}>
            <Alert severity="error">{deleteStatus}</Alert>
          </Snackbar>
        )}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell align="right">amount</TableCell>
              <TableCell align="right">category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseitems.map((row) => (
              <TableRow
                id={row._id}
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.expensetype}
                </TableCell>
                <TableCell align="right">{row.expenseamount}</TableCell>
                <TableCell align="right">{row.category}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() =>
                      edit(
                        row._id,
                        row.expenseamount,
                        row.category,
                        row.expensetype
                      )
                    }
                    variant="outlined"
                  >
                    edit
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => deleteExpenseHandler(row._id)}
                    variant="outlined"
                  >
                    delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Productlist;
