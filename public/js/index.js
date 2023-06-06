var api = "http://localhost:4000";
async function expense(event) {
  event.preventDefault();
  const expenseamount = document.getElementById("amount").value;
  const expensetype = document.getElementById("etype").value;
  const category = document.getElementById("cat").value;
  const token = localStorage.getItem('token');
  const obj = {
    expenseamount,
    category,
    expensetype,
  };

  // axios
  //   .post(`${api}/expense`, obj)
  //   .then((res) => {
  //     showexpenseonscreen(res.data);
  //   })
  //   .catch((err) => console.error(err));
  try {
    const res = await axios.post(`${api}/add-expense`, obj,{headers: {'Authorization': token}});
    showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}
window.addEventListener("DOMContentLoaded", async() => {
  const token = localStorage.getItem('token');
  const jwt = token;
  const payloadBase64 = jwt.split(".")[1];
  const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
  const decodedJwt = JSON.parse(window.atob(base64));
  console.log(decodedJwt);
  try {
    const res = await axios.get(`${api}/get-data`,);

    console.log(res.data.expenses.length);
    for (let i = 0; i < res.data.expenses.length; i++) {
      showexpenseonscreen(res.data.expenses[i]);
      console.log(res.data.expenses[i].expenseamount);
    }
    
  } catch (error) {
    console.log(error)
  }
  
    
});
function showexpenseonscreen(obj) {
  
  const parentele = document.getElementById("listofitems");
  const grocery = document.getElementById("grocery");
  const maintenance = document.getElementById("maintenance");
  const entertainment = document.getElementById("entertainment");
  const childele = document.createElement("li");
  childele.className ="list-group-item";
  childele.textContent = obj.expenseamount + "   " + obj.category + "   " + obj.expensetype;
  
  const deletebtn = document.createElement("input");
  deletebtn.type = "button";
  deletebtn.value = "Delete";
  deletebtn.className="btn btn-outline-danger float-end"
  deletebtn.onclick = async() => {
    
    // axios.delete(`${api}/expense/${obj._id}`
    // ).then(() =>{
    //   if (obj.cat === "grocery") {
    //     grocery.removeChild(childele);
    //   } else if (obj.cat === "entertainment") {
    //     entertainment.removeChild(childele);
    //   } else {
    //     maintenance.removeChild(childele);
    //   }
    // }).catch((err)=>console.error(err));
    try {
      console.log(obj.id);
    const res = await axios.delete(`${api}/delete-expense/${obj.id}`,{headers: {'Authorization': token}});
    console.log(res);
    if (obj.category === "grocery") {
      grocery.removeChild(childele);
    } else if (obj.category === "entertainment") {
      entertainment.removeChild(childele);
    } else {
      maintenance.removeChild(childele);
    }
    } catch (error) {
    console.log(error);
     }
    
    
    //localStorage.removeItem(obj.etype);
    //parentele.removeChild(childele);
  };

  childele.appendChild(deletebtn);
  //childele.appendChild(editbtn);
  //grocery.appendChild(childele);
  //parentele.appendChild(childele);

  if (obj.category === "grocery") {
    grocery.appendChild(childele);
  } else if (obj.category === "entertainment") {
    entertainment.appendChild(childele);
  } else {
    maintenance.appendChild(childele);
  }
}