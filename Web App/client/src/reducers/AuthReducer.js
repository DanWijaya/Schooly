import { SET_CURRENT_USER, USER_LOADING, GET_USERS } from "../actions/Types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  all_users: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
      
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    
    case GET_USERS:
      return{
        ...state,
        all_users: action.payload
      }
    default:
      return state;
  }
}
