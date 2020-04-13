import { SET_CURRENT_USER, USER_LOADING, GET_USERS, GET_TEACHERS, GET_STUDENTS } from "../actions/Types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  all_teachers: [],
  all_students: [],
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
    
    case GET_TEACHERS:
      return{
        ...state,
        all_teachers: action.payload
      }
    
      case GET_STUDENTS: 
      return{
        ...state,
        all_students: action.payload
      }
    default:
      return state;
  }
}
