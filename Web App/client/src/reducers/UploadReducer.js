import { UPLOAD_TUGAS, GET_TUGAS } from "../actions/Types";

const initialState = {};

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_TUGAS: {
      console.log("Payload : ", action.payload);
      return action.payload;
    }
    case GET_TUGAS: {
      console.log("Payload : ", action.payload);
      return action.payload
    }
    default:
      return state
  }
}
