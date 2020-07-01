import { combineReducers } from "redux";
import ErrorReducer from "./ErrorReducer";
import ClassReducer from "./ClassReducer";
import TasksReducer from "./TaskReducer";
import UploadReducer from "./UploadReducer";
import SubjectReducer from "./SubjectReducer";
import UserReducer from "./UserReducer";
import AuthReducer from "./AuthReducer";
import AnnouncementReducer from "./AnnouncementReducer"

export default combineReducers({
  auth: UserReducer,
  errors: ErrorReducer,
  classesCollection: ClassReducer,
  tasksCollection: TasksReducer,
  filesCollection: UploadReducer,
  subjectsCollection: SubjectReducer,
  passwordMatters: AuthReducer,
  announcementsCollection : AnnouncementReducer
});
