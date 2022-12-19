import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import proposalReducer from './reducers/proposal.reducer';

const reducer = combineReducers({
  proposalReducer,
})

export const store = configureStore({
  reducer,
});

