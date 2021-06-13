import {
  GET_ALL_TASKS,
  GET_TASKS_BY_CLASS,
  GET_TASKS_BY_SUBJECTS,
} from "../actions/Types";

// GET_TASKS akan membuat initial state ini menjadi refer ke array of task
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TASKS: {
      return action.payload;
    }
    // case GET_TASKS_BY_CLASS: {
    //   return action.payload;
    // }
    case GET_TASKS_BY_SUBJECTS: {
      return action.payload;
    }
    default:
      return state;
  }
}
