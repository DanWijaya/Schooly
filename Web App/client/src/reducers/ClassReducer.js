import { GET_CLASSES, GET_ALL_CLASSES, SET_CURRENT_CLASS, GET_ALL_CLASSES_MAP } from "../actions/Types";

const initialState = {
  all_classes: [],
  all_classes_map: new Map(),
  selectedClasses: [],
  kelas: {} // for student
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_CLASSES:{
      console.log("Payload : ", action.payload);
      let retrieved = new Map()
      action.payload.map((kelas) => retrieved.set(kelas._id, kelas))
      return {
        ...state,
        selectedClasses: retrieved
      }
    }
    case GET_ALL_CLASSES: {
      console.log("Payload : ", action.payload);
      return{
        ...state,
        all_classes: action.payload
      }
    }
    case GET_ALL_CLASSES_MAP: {
      let temp = new Map();
      action.payload.map((kelas) => temp.set(kelas._id, kelas))
      return{
        ...state,
        all_classes_map: temp
      }
    }
    case SET_CURRENT_CLASS: 
      // console.log("Payload: ", action.payload)
      return {
        ...state,
        kelas: action.payload
      }
    
    default:
      return state
  }
}
