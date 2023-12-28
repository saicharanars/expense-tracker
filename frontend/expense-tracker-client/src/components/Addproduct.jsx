import React, {useEffect,useContext,useRef,useState }from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import axios from 'axios';

import AuthContext from '../store/Authcontext';
import { Navigate } from "react-router-dom";


const Addproduct = () => {
    const expenseInputref = useRef()
    const amountInputref = useRef()
    const expensetypeInputref = useRef()
    const url = "http://localhost:4000/";
    const [addproduct,setAddedproduct] = useState(false)
    const authctx = useContext(AuthContext)

    const [status,setStatus] = useState({
        message:"",
        validation:""
    })
    const handlesubmit = async(e)=>{
        e.preventDefault()
        const expense = expenseInputref.current.value
        const amount = amountInputref.current.value
        const expensetype = expensetypeInputref.current.value
        const body = {
            expenseamount : amount,
            category:expense,
            expensetype:expensetype
        }
        console.log(body)
        if (body){
            try {
                const res = await axios.post(`${url}add-expense`, body, {
                    headers: { Authorization: authctx.token },
                  });
                // Handle successful response
                const status = res.status;
                if (status){
                    if (status == 200){
                        setAddedproduct(true)
                        setStatus({...status,message:res.data.message,validation:"success"})
                        console.log(status)
                    }
                }
                console.log(res)
            } catch (error) {
             console.log(error.response.data)
             setAddedproduct(true)
             setStatus({...status,message:error.response.data.message,validation:"warning"})
             console.log(status)
            }
        }


    }

  return (
    <form onSubmit={handlesubmit}>

          <Grid item sx={{ padding: 2 }}>
            <TextField label="Expense" fullWidth inputRef={expenseInputref} />
          </Grid>
          
            <Grid item sx={{ padding: 2 }}>
              <TextField label="expense amount" type='number' fullWidth inputRef={amountInputref} />
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

          <Grid item sx={{ padding: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              submit
            </Button>
          </Grid>

          <Grid item sx={{ padding: 2 }}>
            {addproduct && <Alert severity={status.validation}>{status.message}</Alert>}
          </Grid>
        </form>
  )
}

export default Addproduct