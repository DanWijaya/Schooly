import { combineReducers } from "redux";
import ErrorReducer from "./ErrorReducer";
import SubjectReducer from "./SubjectReducer";
import ClassReducer from "./ClassReducer";
import TasksReducer from "./TaskReducer";
import UploadReducer from "./UploadReducer";
import MaterialReducer from "./MaterialReducer";
import UserReducer from "./UserReducer";
import AuthReducer from "./AuthReducer";
import AnnouncementReducer from "./AnnouncementReducer"

export default combineReducers({
  auth: UserReducer,
  errors: ErrorReducer,
  classesCollection: ClassReducer,
  tasksCollection: TasksReducer,
  materialsCollection: MaterialReducer, 
  filesCollection: UploadReducer,
  subjectsCollection: SubjectReducer,
  passwordMatters: AuthReducer,
  announcementsCollection : AnnouncementReducer
});
