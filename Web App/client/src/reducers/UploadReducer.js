import { UPLOAD_TUGAS, GET_TUGAS, GET_FILE_BY_USER } from "../actions/Types";

const initialState = {
  files: [],
  selectedFile: {} // for download or preview
};

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_TUGAS: {
      console.log("Payload : ", action.payload);
      return {
        ...state,
        selectedFile: action.payload
      }
    }
    case GET_TUGAS: {
      console.log("Payload : ", action.payload);
      return {
        ...state,
        selectedFile: action.payload
      }
    }
    case GET_FILE_BY_USER: {
      console.log("Paylaod : ", action.payload);
      return {
        ...state,
        files: action.payload
      }
    }
    default:
      return state
  }
}
