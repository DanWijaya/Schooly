import { GET_CLASSES, GET_ALL_CLASSES, SET_CURRENT_CLASS } from "../actions/Types";
import isEmpty from "is-empty";

const initialState = {
  all_classes: [],
  selectedClasses: [],
  kelas: {} // for student
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_CLASSES:{
      console.log("Payload : ", action.payload);
      return {
        ...state,
        selectedClasses: action.payload
      }
    }
    case GET_ALL_CLASSES: {
      console.log("Payload : ", action.payload);
      return{
        ...state,
        all_classes: action.payload
      }
    }
    case SET_CURRENT_CLASS: 
      console.log("Payload: ", action.payload)
      return {
        ...state,
        kelas: action.payload
      }
    
    default:
      return state
  }
}
