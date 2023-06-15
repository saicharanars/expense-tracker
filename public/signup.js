var api = "http://3.109.101.125:4000";


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
    const res = await axios.post(`${api}/signup`, obj);
    console.log(res.data);
    window.location.href = "/loginhtml";
    //showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}
