import {
  SET_CURRENT_USER,
  USER_LOADING,
  GET_USERS,
  GET_ALL_TEACHERS,
  GET_ALL_TEACHERS_MAP,
  GET_ALL_STUDENTS,
  GET_ALL_ADMINS,
  GET_ONE_USER,
  GET_STUDENTS_BY_CLASS,
  GET_PENDING_STUDENTS,
  GET_PENDING_TEACHERS,
  GET_PENDING_ADMINS,
  GET_MY_AVATAR,
} from "../actions/Types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  all_users: [],
  all_admins: [],
  all_teachers: [],
  all_teachers_map: new Map(),
  all_students: [],
  students_by_class: [],
  loading: false,
  pending_admins: [],
  pending_teachers: [],
  pending_students: [],
  selectedUser: {},
  retrieved_users: new Map(),
  all_roles: {
    SUPERADMIN: "SuperAdmin",
    ADMIN: "Admin",
    STUDENT: "Student",
    TEACHER: "Teacher",
  },
  // dropbox_token: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: { ...action.payload, avatar: state.user.avatar },
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_USERS:
      let retrieved = new Map();
      action.payload.map((user) => retrieved.set(user._id, user));
      return {
        ...state,
        retrieved_users: retrieved,
      };
    case GET_ONE_USER: // Teacher or student or anyone.
      return {
        ...state,
        selectedUser: action.payload,
      };
    case GET_MY_AVATAR:
      return {
        ...state,
        user: { ...state.user, avatar: action.payload },
      };
    case GET_ALL_ADMINS:
      return {
        ...state,
        all_admins: action.payload,
      };
    case GET_ALL_TEACHERS:
      return {
        ...state,
        all_teachers: action.payload,
      };
    case GET_ALL_TEACHERS_MAP:
      return {
        ...state,
        all_teachers_map: action.payload,
      };
    case GET_ALL_STUDENTS:
      return {
        ...state,
        all_students: action.payload,
      };
    case GET_STUDENTS_BY_CLASS:
      return {
        ...state,
        students_by_class: action.payload,
      };
    case GET_PENDING_ADMINS:
      return {
        ...state,
        pending_admins: action.payload,
      };
    case GET_PENDING_TEACHERS:
      return {
        ...state,
        pending_teachers: action.payload,
      };
    case GET_PENDING_STUDENTS:
      return {
        ...state,
        pending_students: action.payload,
      };
    // case SET_DROPBOX_TOKEN:
    //   return {
    //     ...state,
    //     dropbox_token: action.payload,
    //   };
    default:
      return state;
  }
}
