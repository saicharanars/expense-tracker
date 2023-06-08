var api = "http://localhost:4000";
async function expense(event) {
  event.preventDefault();
  const expenseamount = document.getElementById("amount").value;
  const expensetype = document.getElementById("etype").value;
  const category = document.getElementById("cat").value;
  const token = localStorage.getItem("token");
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
    const res = await axios.post(`${api}/add-expense`, obj, {
      headers: { Authorization: token },
    });
    showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}
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
function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get(
      "http://localhost:3000/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);
    var leaderboardElem = document.getElementById("leaderboardlist");
    leaderboardElem.innerHTML += "<h1> Leader Board</h1>";
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li>Name - ${userDetails.username} Total Expenses - ${userDetails.total_cost} `;
    });
  };
  document.getElementById("leaderboardlist").appendChild(inputElement);
}
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  const premiumUser = decodeToken.premium;
  userid=decodeToken.userid
  console.log(decodeToken);
  if (premiumUser) {
    document.getElementById("rzp-button1").style.visibility = "hidden";
    document.getElementById("premiummessage").innerHTML =
      "you are premium user";
    document.getElementById("leaderboard").style.visibility = "show"; 
    showLeaderboard(); 
  }
  
  try {
    const res = await axios.get(`${api}/get-data`);

    console.log(res.data.expenses.length);
    for (let i = 0; i < res.data.expenses.length; i++) {
      showexpenseonscreen(res.data.expenses[i]);
      console.log(res.data.expenses[i].expenseamount);
    }
  } catch (error) {
    console.log(error);
  }
});
function showexpenseonscreen(obj) {
  const parentele = document.getElementById("listofitems");
  const grocery = document.getElementById("grocery");
  const maintenance = document.getElementById("maintenance");
  const entertainment = document.getElementById("entertainment");
  const childele = document.createElement("li");
  childele.className = "list-group-item";
  childele.textContent =
    obj.expenseamount + "   " + obj.category + "   " + obj.expensetype;

  const deletebtn = document.createElement("input");
  deletebtn.type = "button";
  deletebtn.value = "Delete";
  deletebtn.className = "btn btn-outline-danger float-end";
  deletebtn.onclick = async () => {
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
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${api}/delete-expense/${obj.id}`, {
        headers: { Authorization: token },
      });
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
document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  console.log(token);
  axios
    .get(`${api}/purchase/premium`, { headers: { Authorization: token } })
    .then((res) => {
      console.log(res);
      const options = {
        key: res.data.key_id, //enter the key id generated from the dashboard
        order_id: res.data.order.id, //for one time payment
        handler: async function () {
          try {
            const res1 = await axios.post(
              `${api}/purchase/update-transaction-status`,
              {
                status: "success",
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            );
            alert("Congrats! You are now a Premium user!");
            document.getElementById("rzp-button1").style.visibility = "hidden";
            document.getElementById("premiummessage").innerHTML =
              "you are premium user";

            localStorage.setItem("token", res1.data.token);
            //showUserInfoInDOM();
          } catch (err) {
            console.log(err);
          }
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", async (err) => {
        try {
          await axios.post(
            `${api}/purchase/update-transaction-status`,
            {
              status: "failed",
              order_id: err.error.metadata.order_id,
            },
            { headers: { Authorization: token } }
          );
          alert("Payment Failed!");
        } catch (err) {
          console.log(err);
        }
      });

      rzp1.open();
      e.preventDefault();
    })
    .catch((err) => console.log(err));
};
