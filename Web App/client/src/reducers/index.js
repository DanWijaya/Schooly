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
import SuccessReducer from "./SuccessReducer";
import AssessmentReducer from "./AssessmentReducer";

export default combineReducers({
  auth: UserReducer,
  announcementsCollection : AnnouncementReducer,
  assessmentsCollection: AssessmentReducer,
  classesCollection: ClassReducer,
  errors: ErrorReducer,
  filesCollection: UploadReducer,
  materialsCollection: MaterialReducer, 
  passwordMatters: AuthReducer,
  subjectsCollection: SubjectReducer,
  success: SuccessReducer,
  tasksCollection: TasksReducer,
});
