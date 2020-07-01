import { UPLOAD_TUGAS, GET_TUGAS, GET_FILE_BY_USER, GET_ALL_FILES_BY_USER, GET_LAMPIRAN_FILES, GET_ALL_LAMPIRAN_BY_TASK } from "../actions/Types";

const initialState = {
  files: [],
  all_user_files: [],
  lampiran_files:[],
  all_lampiran_files:[],
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
    case GET_ALL_FILES_BY_USER: {
      console.log("Paylaod : ", action.payload);
      return{
        ...state,
        all_user_files: action.payload
      }
    }
    case GET_LAMPIRAN_FILES:{
      console.log("Payload : ", action.payload);
      return{
        ...state,
        lampiran_files: action.payload
      }
    }
    case GET_ALL_LAMPIRAN_BY_TASK:{
      console.log("Payload : ", action.payload);
      return{
        ...state,
        all_lampiran_files: action.payload
      }
    }
    default:
      return state
  }
}
