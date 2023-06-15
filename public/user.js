var api ="http://35.154.22.231:4000";

async function userlogin(event) {
  event.preventDefault();
  //const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const obj = {
    email,
    password,
  };
  try {
    const resp = await axios.post(`${api}login`, obj);
    console.log(resp.data);

    if (resp.data.login) {
      localStorage.setItem('token',resp.data.token);
      console.log(localStorage.getItem('token'));
      window.location.href = "/";
    } else {
      console.log("fail");
    }
    // console.log(resp);
    // console.log(resp['login']);

    // if (res.data.login === "login successful") {
    //   console.log("Logging in");
    //
    // } else {
    //   console.log("Unsuccessful login");
    // }
    //showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}

