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
import MockReducer from "../prototypes/mock-users/MockReducer";

export default combineReducers({
  auth: UserReducer,
  mockUserCollection : MockReducer,
  announcementsCollection : AnnouncementReducer,
  assessmentsCollection: AssessmentReducer,
  classesCollection: ClassReducer,
  errors: ErrorReducer, // dari null jd false
  filesCollection: UploadReducer,
  materialsCollection: MaterialReducer,
  passwordMatters: AuthReducer,
  subjectsCollection: SubjectReducer,
  success: SuccessReducer,
  tasksCollection: TasksReducer,
});
