var api ="http://3.109.101.125:4000";
async function forgotpassword(e) {
  try {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userDetails = {
      email: form.get("email"),
    };
    console.log(userDetails);
 
    const response = await axios.post(
      `${api}/password/forgotpassword`,
      userDetails
    );
    console.log(response);
    if (response.status === 201) {
      document.body.innerHTML += '<div style="color:red;">Mail Successfully sent <div>';
      const link = document.createElement("a");
      link.innerText="click here to reset your password reset ";
      link.href=`${api}/password/resetpassword/${response.passwordrequestid}`;
      const forget = document.getElementById("reset");
      forget.append(link);
    } else {
      throw new Error("Something went wrong!!!");
    }
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}