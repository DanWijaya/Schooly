import { SET_CURRENT_USER, USER_LOADING, GET_USERS, GET_ALL_TEACHERS, GET_ALL_STUDENTS, GET_ONE_USER, GET_STUDENTS_BY_CLASS, GET_PENDING_STUDENTS, GET_PENDING_TEACHERS } from "../actions/Types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  all_teachers: [],
  all_students: [],
  students_by_class: [],
  loading: false,
  pending_students: [],
  pending_teachers: [],
  selectedUser: {},
  retrieved_users: new Map()
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
    case GET_ALL_TEACHERS:
      return{
        ...state,
        all_teachers: action.payload
      }
    case GET_ALL_STUDENTS:
      return{
        ...state,
        all_students: action.payload
      }
    case GET_STUDENTS_BY_CLASS:
      return{
        ...state,
        students_by_class: action.payload
      }
    case GET_ONE_USER: //teacher or student or anyone lah.
      return {
        ...state,
        selectedUser: action.payload
    }
    case GET_USERS: 
      let retrieved = new Map()
      action.payload.map((user) => retrieved.set(user._id, user))
      return {
        ...state,
        retrieved_users: retrieved
      }
    case GET_PENDING_STUDENTS:
      return {
        ...state,
        pending_students: action.payload
      }
    case GET_PENDING_TEACHERS:
      return {
        ...state,
        pending_teachers: action.payload
      }
    default:
      return state;
  }
}
