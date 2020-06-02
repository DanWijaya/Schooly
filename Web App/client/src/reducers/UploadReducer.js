import { UPLOAD_TUGAS } from "../actions/Types";

const initialState = {};

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_TUGAS: {
      console.log("Payload : ", action.payload);
      return action.payload;
    }
    default:
      return state
  }
}
