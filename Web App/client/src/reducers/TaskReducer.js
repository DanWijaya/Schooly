import { GET_TASKS } from "../actions/Types";

// GET_TASKS akan membuat initial state ini menjadi refer ke array of task
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TASKS: {
      console.log("Payload : ", action.payload);
      return action.payload;
    }
    default:
      return state;
  }
}
