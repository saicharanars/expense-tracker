import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// import { useHistory } from "react-router-dom";
import { useRef, useContext } from "react";
import AuthContext from "../store/Authcontext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

export default function Authform() {
  const emailInputref = useRef();
  const passwordInputref = useRef();
  const confirmpasswordInputref = useRef();
  const userinputref = useRef();
  const authCtx = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState("");
  const [signupInProgress, setSignupInProgress] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (token) {
      setLoggedin(true);
    }
  }, [token]);
  const switchbutton = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };
  const handlesubmit = async (e) => {
    e.preventDefault();

    const email = emailInputref.current.value;
    const password = passwordInputref.current.value;
    setSignupInProgress(true);
    const url = "http://localhost:4000/";
    const body = {
      email: email,
      password: password,
    };
    if (isLogin) {
      try {
        const res = await axios.post(`${url}login`, body);

        // Handle successful response
        const status = res.status;
        switch (status) {
          case 200:
            authCtx.login(res.data.token);
            setLoggedin(true);
            break;
          // Handle other status codes...
        }
      } catch (error) {
        // Handle errors, including 404
        if (error.response && error.response.status === 404) {
          console.log(error.response);
          setError(error.response.data.message);
        } else if (error.response && error.response.status === 401) {
          setError(error.response.data.message);
        } else if (error.response && error.response.status === 500) {
          setError("Internal server error");
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
        const res = await axios.post(`${url}signup`, signupbody);

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
          bgcolor: "palegreen",
        }}
      >
        <Container
          sx={{
            maxWidth: "sm",
            bgcolor: "white",
          }}
        >
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
          {signupInProgress && <p>Sending Request...</p>}
          {signupSuccess && <Alert severity="success">{signupSuccess}</Alert>}

          <Grid item sx={{ padding: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Grid>
          <Grid item sx={{ padding: 2 }}>
            <Button onClick={switchbutton} variant="text" fullWidth>
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
