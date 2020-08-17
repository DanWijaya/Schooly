import { GET_ERRORS } from "../actions/Types";

const initialState = {};

export default function(state = initialState, action) {
  // action = {
  //   type: "GET_ERRORS",
  //   payload: false
  // }
  switch (action.type) {
    case GET_ERRORS:
      return action.payload; // false

    default:
      return state;
  }
}
