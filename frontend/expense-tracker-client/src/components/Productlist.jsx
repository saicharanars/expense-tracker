import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell,{tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  editexpensedataslice,
  setupdatebutton,
  getExpenseslice,
  deleteExpenseslice,
} from "../redux/Expensereducer";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Addproduct from "./Addproduct";
import Editproduct from "./Editproduct";
import { styled } from '@mui/material/styles';

const Productlist = () => {
  const dispatch = useDispatch();
  const expenseitems = useSelector((state) => state.expense.items);
  const updateonaddproduct = useSelector((state) => state.expense.updatebutton);
  const token = useSelector((state) => state.auth.token);
  const [updatebutton, setUpdatebutton] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expensecount, setExpensecount] = useState(10);
  const [deletestatus, setDeletestatus] = useState("");
  const url = "http://localhost:4000/";
  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  const expense = async (currentpage, rowsperpage) => {
    console.log("jcvh");
    const jwt = parseJwt(token);
    // const totalPages = Math.ceil(jwt.expensecount / rowsperpage);
    console.log(jwt, jwt.expensecount, "token>>>>>>>>>>");
    console.log(
      currentPage,
      rowsPerPage,
      rowsperpage,
      currentPage,
      " jbefore>>>>>>>f"
    );

    setExpensecount(jwt.expensecount);
    setCurrentPage(currentpage);
    setRowsPerPage(rowsperpage);
    console.log(
      currentPage,
      rowsPerPage,
      offset,
      " jb>>>>>>>>>>cjf",
      expensecount
    );
    const response = await axios.get(
      `${url}allexpenses?page=${currentpage + 1}&rows=${rowsperpage}`,
      { headers: { Authorization: token } }
    );
    const data = response.data.expenses;
    console.log(data);
    dispatch(getExpenseslice(data));
  };

  useEffect(() => {
    console.log(offset, rowsPerPage, "initial>>>>>>>");
    expense(offset, rowsPerPage);
    console.log(expenseitems);
  }, [updatebutton]);
  const handleNext = (event, value) => {
    // setCurrentPage(value)
    console.log("fjbhj", parseInt(event.target.value, 10), event);
    expense(value, rowsPerPage);
    // const nextPage = currentPage + 1;
    // setCurrentPage(nextPage);
  };
  const handlerows = (event, value) => {
    console.log(currentPage, "fjhmknjkbhj", event.target.value);
    expense(0, event.target.value);
  };

  const edit = (_id, previousamount, prevcategory, prevtype) => {
    console.log(
      _id,
      previousamount,
      prevcategory,
      prevtype,

      "gfvub"
    );
    const body = {
      _id,
      previousamount,
      prevcategory,
      prevtype,
    };
    setUpdatebutton(true);
    console.log(updatebutton, updateonaddproduct);
    dispatch(setupdatebutton());
    dispatch(editexpensedataslice(body));
    // setUpdatebutton(false);
    // dispatch(setupdatebutton());
  };
  const deleteExpense = async (id) => {
    try {
      const res = await axios.delete(`${url}delete-expense/${id}`, {
        headers: { Authorization: token },
      });
      const status = res.status;
      console.log(res);
      if (res.status == 200) {
        dispatch(deleteExpenseslice({ _id: id }));
      }
      setDeletestatus("Expense deleted successfully");
      setTimeout(() => {
        setDeletestatus("");
        setExpensecount(expensecount - 1);
      }, 1000);
    } catch (error) {
      console.log(error, "cgv");
      setDeletestatus(error.response.data.message);
      setTimeout(() => {
        setDeletestatus("");
      }, 1000);
    }
  };
  const deleteExpenseHandler = (id) => {
    deleteExpense(id);
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#FF9292",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          p: 2,
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            p: 2,
          }}
        >
          <Paper
            sx={{
              borderRadius: 5,
            }}
          >
            <Container
              maxWidth="lg"
              sx={{
                p: 2,
              }}
            >
              <Stack direction="row">
                <TableContainer
                  sx={{
                    p: 1,
                  }}
                >
                  {deletestatus && (
                    <Snackbar open={!!deletestatus} autoHideDuration={1000}>
                      <Alert severity="error">{deletestatus}</Alert>
                    </Snackbar>
                  )}

                  <Table
                    component={Paper}
                    sx={{ minWidth: 200 }}
                    aria-label="simple table"
                    stickyHeader 
                  >
                    <TableHead sx={{
                        backgroundColor:"#F9FAFC"
                    }}>
                      <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Amount</StyledTableCell>
                        <StyledTableCell align="right">Category</StyledTableCell>
                        <StyledTableCell align="right">Edit</StyledTableCell>
                        <StyledTableCell align="right">Delete</StyledTableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenseitems &&
                        expenseitems.map((row) => (
                          <TableRow
                            id={row._id}
                            key={row._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="left" component="th" scope="row">
                              {row.expensetype}
                            </TableCell>
                            <TableCell align="right">
                              {row.expenseamount}
                            </TableCell>
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
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[1, 5, 8]}
                          // colSpan={3}
                          count={expensecount}
                          rowsPerPage={rowsPerPage}
                          page={currentPage}
                          onPageChange={handleNext}
                          onRowsPerPageChange={handlerows}
                          // ActionsComponent={handleNext}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
                {updatebutton && (
                  
                    <Stack direction="column">
                      <IconButton
                        sx={{
                          float: "right",
                          alignSelf:"flex-end",
                          width:"2rem",
                        }}
                        onClick={() => setUpdatebutton(false)}
                        aria-label="close"
                        
                      >
                        <CloseIcon />
                      </IconButton>
                    
                    <Editproduct />
                    </Stack>

                  
                )}
              </Stack>
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Productlist;
