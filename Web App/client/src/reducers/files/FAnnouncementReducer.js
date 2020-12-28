import { GET_ANNOUNCEMENT_FILES, GET_ALL_ANNOUNCEMENT_FILES } from "../../actions/Types"

const initialState = {
    announcement_files: [],
    all_announcement_files: [],
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_ANNOUNCEMENT_FILES: {
          return {
          ...state,
          announcement_files: action.payload
          }
        }
        case GET_ALL_ANNOUNCEMENT_FILES: {
          return {
          ...state,
          all_announcement_files: action.payload
          }
        }
        default: 
          return state
    }
}
