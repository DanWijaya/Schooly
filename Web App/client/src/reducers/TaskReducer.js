import { GET_ALL_TASKS, GET_TASK } from "../actions/Types";

const initialState = {
  selectedTasks: [],
  all_tasks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TASKS: {
      return {
        ...state,
        all_tasks: action.payload,
      };
    }
    case GET_TASK: {
      return {
        ...state,
        selectedTasks: action.payload,
      };
    }
    default:
      return state;
  }
}
