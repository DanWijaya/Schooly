import { GET_MATERIAL_FILES, GET_ALL_MATERIAL_FILES } from "../../actions/Types"

const initialState = {
    material_files: [],
    all_material_files: [],
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_MATERIAL_FILES: {
          return {
          ...state,
          material_files: action.payload
          }
        }
        case GET_ALL_MATERIAL_FILES: {
          return {
          ...state,
          all_material_files: action.payload
          }
        }
        default: 
          return state
    }
}
