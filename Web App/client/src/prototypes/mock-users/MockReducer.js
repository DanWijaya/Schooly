const initialState = {
  all_teachers: [],
  all_students: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "GET_ALL_MOCK_TEACHERS":
      return {
        ...state,
        all_teachers: action.payload,
      };
    case "GET_ALL_MOCK_STUDENTS":
      return {
        ...state,
        all_students: action.payload,
      };
    default:
      return state;
  }
}
