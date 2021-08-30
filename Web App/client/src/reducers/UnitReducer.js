import { GET_ALL_UNITS, GET_UNIT } from "../actions/Types";

const initialState = {
  selectedUnits: {},
  all_units: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_UNITS: {
      return {
        ...state,
        all_units: action.payload,
      };
    }
    case GET_UNIT: {
      return {
        ...state,
        selectedUnits: action.payload,
      };
    }
    default:
      return state;
  }
}
