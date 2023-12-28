import axios from "axios";
import React, { useEffect, useContext, useState,useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import AuthContext from "../store/Authcontext";
 const Productlist = () => {
  
  const authctx = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productlist, setProductlist] = useState([]);
  const productref = useRef()

  const url = "http://localhost:4000/";
  useEffect( () => {
    async function fetchexpenses(){

        const response = await axios.get(
            `${url}allexpenses?page=${currentPage}&rows=${rowsPerPage}`,
            { headers: { Authorization: authctx.token } }
            );
            console.log(response.data.expenses);
            setProductlist(response.data.expenses)
            console.log(productlist)
        }
    fetchexpenses();    
  }, []);
  const edit = (e)=>{
    e.preventDefault()
    console.log(productref.current.value)
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell  align="right">amount</TableCell>
            <TableCell align="right">category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productlist.map((row) => (
            <TableRow
              id = {row._id}  
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.expensetype}
              </TableCell>
              <TableCell align="right">{row.expenseamount}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right"><Button onClick={edit}  inputRef={productref} variant="outlined">edit</Button></TableCell>
              <TableCell align="right"><Button variant="outlined">delete</Button></TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default Productlist