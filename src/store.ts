import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import proposalReducer from "./reducers/proposal";

const reducer = combineReducers({
  proposalReducer,
});

export const store = configureStore({
  reducer,
});
