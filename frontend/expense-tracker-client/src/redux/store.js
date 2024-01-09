import {combineReducers,configureStore} from "@reduxjs/toolkit"
import authSlice from "./Authreducer";
import expenseslice from "./Expensereducer";

const rootReducer = combineReducers({
    auth:authSlice.reducer,
    expense:expenseslice.reducer
})
const store = configureStore({
    reducer:rootReducer
})
export default store;