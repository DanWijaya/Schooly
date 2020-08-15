import {GET_ALL_MATERIALS, GET_MATERIAL } from "../actions/Types";

const initialState = {
    selectedMaterials: [],
    all_materials: [],
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_ALL_MATERIALS: {
          return {
          ...state,
          all_materials: action.payload
          }
        }
        case GET_MATERIAL: {
          return {
          ...state,
          selectedMaterials: action.payload
          }
        }
        default: 
          return state
    }
}
