var api = "http://localhost:4000/";


async function user(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const obj = {
    username,
    email,
    password
  };
  try {
    const res = await axios.post(`${api}signup`, obj);
    console.log(res.data);
    //showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}
async function userlogin(event) {
  event.preventDefault();
  //const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const obj = {
    email,
    password
  };
  try {
    const res = await axios.post(`${api}login`, obj);
    console.log(res.data);
    //showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}