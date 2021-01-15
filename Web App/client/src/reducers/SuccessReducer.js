import { GET_SUCCESS_RESPONSE, CLEAR_SUCCESS_RESPONSE } from "../actions/Types";

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SUCCESS_RESPONSE:
      return action.payload;

    case CLEAR_SUCCESS_RESPONSE:
      return null;

    default:
      return state;
  }
}
