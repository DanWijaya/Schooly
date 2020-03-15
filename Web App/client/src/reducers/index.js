import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ErrorReducer from "./ErrorReducer";
import ClassReducer from "./ClassReducer";
import TasksReducer from "./TaskReducer";

export default combineReducers({
  auth: AuthReducer,
  errors: ErrorReducer,
  classesCollection: ClassReducer,
  tasksCollection: TasksReducer,
});
