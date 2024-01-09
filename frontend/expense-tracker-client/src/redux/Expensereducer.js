import { createSlice } from "@reduxjs/toolkit";
import { useState } from "react";

const initialState = {
  items: [],
  editexpensedata: {},
  expenseitems: {},
  updatebutton: false,
  validation: {},
};

const expenseslice = createSlice({
  name: "expense",
  initialState: initialState,
  reducers: {
    getExpenseslice: (state, action) => {
      return {
        ...state,
        items: action.payload,
      };
    },
    addExpenseslice: (state, action) => {
      console.log(state);
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    },
    deleteExpenseslice: (state, action) => {
        console.log(action.payload);
        return {
          ...state,
          items: state.items.filter((item) => item._id !== action.payload._id),
        };
      },
      
    updateExpenseslice: (state, action) => {
      return {
        ...state,
        items: state.items.map((item) => {
          item._id == action.payload._id ? action.payload : item;
        }),
      };
    },
    editexpensedataslice: (state, action) => {
      return {
        ...state,
        editexpensedata: action.payload,
      };
    },
    removeeditexpensedata: (state) => {
      return {
        ...state,
        editexpensedata: null,
      };
    },

    setupdatebutton: (state) => {
      return {
        ...state,
        updatebutton: !state.updatebutton,
      };
    },

    setvalidation: (state, action) => {
      return {
        validation: action.payload,
      };
    },
  },
});
export const {
  editexpensedataslice,
  getExpenseslice,
  addExpenseslice,
  updateExpenseslice,
  removeeditexpensedata,
  setupdatebutton,
  deleteExpenseslice,
  setvalidation,
} = expenseslice.actions;
export default expenseslice;
