import { GET_ALL_ASSESSMENTS, GET_ASSESSMENT} from "../actions/Types";

const initialState = {
  selectedAssessments: [],
  all_assessments: []
}

export default function(state=initialState, action) {
  switch(action.type) {
    case GET_ALL_ASSESSMENTS: {
      return {
        ...state,
        all_assessments: action.payload 
      }
    }

    case GET_ASSESSMENT: {
      return {
        ...state,
        selectedAssessments: action.payload
      }
    }

    default: 
        return state
  }
}