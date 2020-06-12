import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ErrorReducer from "./ErrorReducer";
import ClassReducer from "./ClassReducer";
import TasksReducer from "./TaskReducer";
import UploadReducer from "./UploadReducer";
import SubjectReducer from "./SubjectReducer";

export default combineReducers({
  auth: AuthReducer,
  errors: ErrorReducer,
  classesCollection: ClassReducer,
  tasksCollection: TasksReducer,
  filesCollection: UploadReducer,
  subjectsCollection: SubjectReducer,
});
