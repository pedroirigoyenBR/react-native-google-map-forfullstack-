import { combineReducers } from 'redux';
import { LOGOUT_USER } from '../types';
import user from './user';

const appReducer = combineReducers({ user });
export default (state, action) => {
//   if (action.type === LOGOUT_USER) {
//     state = undefined;
//   }
  return appReducer(state, action);
};
