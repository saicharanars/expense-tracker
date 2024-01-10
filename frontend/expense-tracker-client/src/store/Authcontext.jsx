import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  deleteExpense: () => {},
  expenseitems: [],
  addExpense: () => {},
  fetchexpense: () => {},
  addProductstatus: {},
  deleteStatus: "",
  editExpense: () => {},
  editExpensedata: () => {},
  editExpensedatajson: {},
  updatebutton: false,
});
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [expenseitems, setExpenseitems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetch, setFetch] = useState(false);
  const [addproductstatus, setAddproductstatus] = useState();
  const [deletestatus, setdeletestatus] = useState("");
  const [editExpensedatajson, setEditExpensedatajson] = useState();
  const [updatebutton, setUpdatebutton] = useState(false);

  const userIsLoggedIn = !!token;
  const url = "http://3.110.221.145:4000/";

  const expense = async (currentpage, rowsperpage) => {
    setCurrentPage(currentpage);
    setRowsPerPage(rowsperpage);
    const response = await axios.get(
      `${url}allexpenses?page=${currentPage}&rows=${rowsPerPage}`,
      { headers: { Authorization: token } }
    );
    const data = response.data.expenses;

    setExpenseitems(data);
    console.log("jcvh", expenseitems);
  };

  const fetchexpense = (currentpage, rowsperpage) => {
    setFetch(true);
    console.log(fetch);
    setFetch(false);
  };
  useEffect(() => {
    expense(currentPage, rowsPerPage);
    console.log(fetch);
  }, [fetch]);

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  const addexpense = async (expense, expenseamount, category) => {
    const newexpense = {
      expenseamount: expenseamount,
      category: category,
      expensetype: expense,
    };
    try {
      const res = await axios.post(`${url}add-expense`, newexpense, {
        headers: { Authorization: token },
      });
      const status = res.status;
      if (status) {
        if (status == 200) {
          console.log(res.data.expenses);
          const loadedExpItem = {
            _id: res.data.expenses._id,
            expenseamount: res.data.expenses.expenseamount,
            category: res.data.expenses.category,
            expensetype: res.data.expenses.expensetype,
          };
          setExpenseitems((prevExpItems) => [...prevExpItems, loadedExpItem]);
          const result = { message: res.data.message, validation: "success" };
          setAddproductstatus(result);
          setTimeout(() => {
            setAddproductstatus();
          }, 2000);

          console.log(addproductstatus, "jhvjfdgyfg");
        }
      }
    } catch (error) {
      console.log(error);
      setAddproductstatus({
        message: error.response.data.message,
        validation: "warning",
      });
      setTimeout(() => {
        setAddproductstatus();
      }, 2000);
    }
  };
  const deleteexpense = async (id) => {
    try {
      const res = await axios.delete(`${url}delete-expense/${id}`, {
        headers: { Authorization: token },
      });
      const status = res.status;
      console.log(res);
      if (res.status == 200) {
        const items = expenseitems.filter((expItem) => expItem._id !== id);
        setExpenseitems((expenseitems) =>
          expenseitems.filter((expItem) => expItem._id !== id)
        );
        console.log(items, "buhuf");
        setdeletestatus("Expense deleted successfully");
        setTimeout(() => {
          setdeletestatus("");
        }, 1000);
      }
    } catch (error) {
      console.log(error.response, "cgv");
      setdeletestatus(error.response.data.message);
      console.log(deletestatus, "fn", error.response.data.message);
      setTimeout(() => {
        setdeletestatus("");
      }, 1000);
    }
  };
  const editExpensedata = (id, amount, category, type) => {
    setEditExpensedatajson({
      _id: id,
      expenseamount: amount,
      expensecategory: category,
      expensetype: type,
    });
    setUpdatebutton(true);
  };
  const editexpense = async (category, amount, type) => {
    const updateitem = {
      expensetype: type,
      expenseamount: Number(amount),
      expensecategory: category,
      prevamount: editExpensedatajson.expenseamount,
    };
    try {
      console.log(updateitem);
      const res = await axios.put(
        `${url}edit-expense/${editExpensedatajson._id}`,
        updateitem,
        {
          headers: { Authorization: token },
        }
      );
      const status = res.status;
      console.log(res, "vgvbvg");
      if (status == 200) {
        const updatedItems = expenseitems.map((item) => {
          if (item._id === editExpensedatajson._id) {
            console.log("cnj");
            // Replace the item with id 2
            const updateditemafte = {
              ...item,
              expensetype: type,
              expenseamount: Number(amount),
              expensecategory: category,
            };
            console.log(updateditemafte);
            return updateditemafte; // You can replace this with your new object
          }
          return item; // Keep other items unchanged
        });
        console.log(updatedItems);
        setExpenseitems(updatedItems);
        const result = { message: res.data.message, validation: "success" };
        setAddproductstatus(result);
        setTimeout(() => {
          setAddproductstatus();
        }, 2000);
        setTimeout(() => {
          setdeletestatus("");
          setUpdatebutton(false);
          setEditExpensedatajson();
        }, 1000);
      }
    } catch (error) {
      console.log(error.response);
      setAddproductstatus({
        message: "error.response.data.message",
        validation: "warning",
      });
      setTimeout(() => {
        setAddproductstatus();
        setUpdatebutton(false);
        setEditExpensedatajson();
      }, 1000);
    }
  };

  useEffect(() => {
    if (userIsLoggedIn) {
      const loginTime = Date.now();
      localStorage.setItem("loginTime", loginTime);

      const checkInactive = () => {
        const currentTime = Date.now();
        const loginTime = localStorage.getItem("loginTime");
        const inactiveTime = currentTime - loginTime;
        const minutesInactive = Math.floor(inactiveTime / 1000 / 60);

        if (minutesInactive >= 15) {
          logoutHandler();
          window.location.href = "/"; // Redirect to the logout page
        }
      };

      const timer = setInterval(checkInactive, 1000);

      return () => clearInterval(timer);
    }
  }, [userIsLoggedIn]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    expenseitems: expenseitems,
    fetchexpense: fetchexpense,
    addExpense: addexpense,
    addProductstatus: addproductstatus,
    deleteExpense: deleteexpense,
    deleteStatus: deletestatus,
    editExpense: editexpense,
    editExpensedata: editExpensedata,
    editExpensedatajson: editExpensedatajson,
    updatebutton: updatebutton,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
