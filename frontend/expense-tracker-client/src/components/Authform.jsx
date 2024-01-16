import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useRef } from "react";
import LinearProgress from "@mui/material/LinearProgress";

import axios from "axios";
import { Navigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/Authreducer";
import store from "../redux/store";
import { Typography } from "@mui/material";
const CancelToken = axios.CancelToken;
export default function Authform() {
  const emailInputref = useRef();
  const passwordInputref = useRef();
  const confirmpasswordInputref = useRef();
  const userinputref = useRef();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const source = CancelToken.source();

  const [isLogin, setIsLogin] = useState(true);
  const [signupInProgress, setSignupInProgress] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (token) {
      console.log(token);
      setLoggedin(true);
    }
  }, [token]);
  const switchbutton = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timeout");
      setSignupInProgress(false);
      setError("Request timedout,please retry"); // Cancel the request with a custom message
    }, 5000);
    const email = emailInputref.current.value;
    const password = passwordInputref.current.value;
    setSignupInProgress(true);
    const url = "https://expense-tracker-mzom.onrender.com/";

    const body = {
      email: email,
      password: password,
    };
    if (isLogin) {
      try {
        const res = await axios.post(`${url}login`, body, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        // Handle successful response
        const status = res.status;
        switch (status) {
          case 200:
            dispatch(
              authActions.login({
                token: res.data.token,
                email: email,
              })
            );
            console.log("State:", store.getState());
            setSignupInProgress(false);

            window.location.href = "/home";

            break;
        }
      } catch (error) {
        // Handle errors, including 404
        if (error.response && error.response.status === 404) {
          console.log(error.response);
          setError(error.response.data.message);
          setSignupInProgress(false);
        } else if (error.response && error.response.status === 401) {
          setError(error.response.data.message);
          setSignupInProgress(false);
        } else if (error.response && error.response.status === 500) {
          setError("Internal server error");
          setSignupInProgress(false);
        }
      }
    } else {
      try {
        const username = userinputref.current.value;
        const signupbody = {
          ...body,
          username: username,
        };
        setSignupInProgress(true);
        const res = await axios.post(`${url}signup`, signupbody, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);

        // Handle successful response
        const status = res.status;
        switch (status) {
          case 200:
            setSignupSuccess(res.data.message);
            console.log(res.data);
            break;
          // Handle other status codes...
        }
      } catch (error) {
        // Handle errors, including 404
        if (error.response && error.response.status === 401) {
          console.log(error.response);
          setError(error.response.data.message);
        } else if (error.response && error.response.status === 500) {
          setError("Internal server error");
        }
      }
    }
  };
  const passwordmatch = (e) => {
    e.preventDefault();
    const password = passwordInputref.current.value;
    const confirmpassword = confirmpasswordInputref.current.value;
    if (password == confirmpassword) {
      setPasswordMatch(true);
    } else {
      if (passwordMatch) {
        setPasswordMatch(false);
      }
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          bgcolor: "#Fbdede",
        }}
      >
        <Container
          sx={{
            maxWidth: "sm",
            bgcolor: "white",
          }}
        >
          <Grid item sx={{ padding: 2 }}>
            <Typography variant="h4" component="h5">
              Expense Tracker
            </Typography>
          </Grid>
          <Grid item sx={{ padding: 2 }}>
            <TextField label="Email" fullWidth inputRef={emailInputref} />
          </Grid>
          {!isLogin && (
            <Grid item sx={{ padding: 2 }}>
              <TextField label="username" fullWidth inputRef={userinputref} />
            </Grid>
          )}

          <Grid item sx={{ padding: 2 }}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              inputRef={passwordInputref}
            />
          </Grid>

          {!isLogin && (
            <Grid item sx={{ padding: 2 }}>
              <TextField
                label="ConfirmPassword"
                type="password"
                variant="outlined"
                fullWidth
                error={!passwordMatch}
                inputRef={confirmpasswordInputref}
                onChange={passwordmatch}
                helperText={
                  passwordMatch ? "password matched" : "Password mismatched"
                }
              />
            </Grid>
          )}
          {signupInProgress && (
            <Grid item sx={{ padding: 2 }}>
              <LinearProgress />
            </Grid>
          )}
          {signupSuccess && <Alert severity="success">{signupSuccess}</Alert>}

          <Grid item sx={{ padding: 2 }}>
            <Button
              sx={{
                backgroundColor: "#FF9292",
                "&:hover": {
                  backgroundColor: "#FF9292",
                },
              }}
              type="submit"
              variant="contained"
              fullWidth
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Grid>
          <Grid item sx={{ padding: 2 }}>
            <Button
              sx={{
                color: "#FF9292",
              }}
              onClick={switchbutton}
              variant="text"
              fullWidth
            >
              {isLogin ? "signup" : "login"}
            </Button>
          </Grid>
          {loggedin && <Alert severity="success">login sucessful</Alert>}
          {loggedin && <Navigate to="/dashboard" replace={true} />}
          {error && <Alert severity="warning">{error}</Alert>}
        </Container>
      </Grid>
    </form>
  );
}
