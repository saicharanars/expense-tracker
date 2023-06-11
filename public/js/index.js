var api = "http://localhost:4000";
//1
let currentPage = 1;
let rowsPerPage = localStorage.getItem('rowsPerPage')?localStorage.getItem('rowsPerPage'):5;

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
    console.log(res);
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
      leaderboardElem.innerHTML += `<li>Name - ${userDetails.username} Total Expenses - ${userDetails.totalExpenses} `;
    });
  };
  document.getElementById("leaderboardlist").appendChild(inputElement);
}
// window.addEventListener("DOMContentLoaded", async () => {
//   const token = localStorage.getItem("token");
//   const decodeToken = parseJwt(token);
//   const premiumUser = decodeToken.premium;
//   userid = decodeToken.userid;
//   console.log(decodeToken);
//   if (premiumUser) {
//     document.getElementById("rzp-button1").style.visibility = "hidden";
//     document.getElementById("premiummessage").innerHTML =
//       "you are premium user";
//     document.getElementById("leaderboard").style.visibility = "show";
//     showLeaderboard();
//   }

//   try {
//     console.log("get-data");
//     const res = await axios.get(`${api}/get-data/${userid}`);
//     console.log(res);
//     console.log(res.data.expenses.length);
//     for (let i = 0; i < res.data.expenses.length; i++) {
//       showexpenseonscreen(res.data.expenses[i]);
//       showtableonscreen(res.data.expenses[i]);
//       //console.log(res.data.expenses[i].expenseamount);
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });
document.addEventListener('DOMContentLoaded', getExpenses); 
function showexpenseonscreen(obj) {
  

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
      expense.removeChild(childele)
      
    } catch (error) {
      console.log(error);
    }

    //localStorage.removeItem(obj.etype);
    //parentele.removeChild(childele);
  };

  childele.appendChild(deletebtn);
  const expense = document.getElementById("expenses");
  //childele.appendChild(editbtn);
  expense.appendChild(childele);
  //parentele.appendChild(childele);
  
};

async function pagination(totalCount) {
  try {
    const maxPages = Math.ceil(totalCount / rowsPerPage);
    document.getElementById('prev-btn').style.display = currentPage > 1 ? "block" : "none";
    document.getElementById('next-btn').style.display = maxPages > currentPage ? "block" : "none";
    document.getElementById('rows-per-page').value = rowsPerPage;
    const start = (currentPage - 1) * rowsPerPage + 1;
    const temp = start + Number(rowsPerPage) - 1;
    const end = temp < totalCount ? temp : totalCount;
    document.getElementById('page-details').textContent = `Showing ${start}-${end} of ${totalCount}`;
  } catch (error) {
    console.error(error);
  }
  
  document.getElementById('prev-btn').onclick = function() {
    showPreviousPage(totalCount);
  };
  
  document.getElementById('next-btn').onclick = function() {
    showNextPage(totalCount);
  };
}

async function getExpenses() {
    // fetch data from server here and update the UI
    document.getElementById("expenses").innerHTML = "";
    try{
      const token = localStorage.getItem('token');
      const decodedToken = parseJwt(token);
      const ispremiumuser = decodedToken.ispremiumuser;
      if(ispremiumuser){
          showPremiumuserMessage();
          showLeaderboard();
          showDownloadButtons();
      };
      const response = await axios.get(`http://localhost:3000/allexpenses?page=${currentPage}&rows=${rowsPerPage}`, { headers: {'Authorization': token}})
     document.getElementById('expenses').innerHTML = "";
     const { expenses, totalCount } = response.data;
     pagination(totalCount);
     if (expenses.length > 0) {
         for (let i = 0; i < expenses.length; i++) {
          showexpenseonscreen(response.data.expenses[i]);
         }
     } else {
         document.getElementById('err').textContent = "Currently there are no Expenses!"
     }
  } catch (error) {
     console.log(error);
  }
  }  
  async function showChangedRows() {
    try {
      rowsPerPage = event.target.value;
      localStorage.setItem('rowsPerPage', rowsPerPage);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  
  async function showPreviousPage(totalCount) {
    try {
      currentPage--;
      await getExpenses();
      pagination(totalCount); // call pagination function after fetching data
    } catch (error) {
      console.error(error);
    }
  }
  
  async function showNextPage(totalCount) {
    try {
      currentPage++;
      await getExpenses();
      pagination(totalCount); // call pagination function after fetching data
    } catch (error) {
      console.error(error);
    }
  }
function showtableonscreen(obj) {
  const table = document.getElementById("tablebody");
  const tr = document.createElement("tr");

  const id = document.createElement("th");
  id.textContent = obj.id;
  tr.appendChild(id);

  const expenseamount = document.createElement("th");
  expenseamount.textContent = obj.expenseamount;
  tr.appendChild(expenseamount);

  const expensecategory = document.createElement("th");
  expensecategory.textContent = obj.category;
  tr.appendChild(expensecategory);

  const expensetype = document.createElement("th");
  expensetype.textContent = obj.expensetype;
  tr.appendChild(expensetype);

  table.appendChild(tr);
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
async function downloadFileList() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/download", {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      const downloadedFiles = response.data.downloads;
      console.log(downloadedFiles);
      // Display the list of downloaded files on the screen
      const downloadList = document.getElementById("download-list");
      downloadList.innerHTML = "";
      for (let i = 0; i < downloadedFiles.length; i++) {
        const fileLink = document.createElement("a");
        fileLink.href = downloadedFiles[i].fileURL;
        fileLink.textContent = downloadedFiles[i].fileName;
        downloadList.appendChild(fileLink);
      }
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}
async function download() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/download", {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      var a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = "myexpense.txt";
      a.innerText = response.data.fileURL;
      a.click();
      const downloadlist = document.getElementById("download-list");
      const li = document.createElement("li");
      li.append(a);
      downloadlist.append(li);
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    window.alert(err);
  }
}