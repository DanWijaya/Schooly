import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import UserReducer from "./UserReducer";
import UnitReducer from "./UnitReducer";
import EventReducer from "./EventReducer";
import ClassReducer from "./ClassReducer";
import SubjectReducer from "./SubjectReducer";
import AnnouncementReducer from "./AnnouncementReducer";
import MaterialReducer from "./MaterialReducer";
import TasksReducer from "./TaskReducer";
import AssessmentReducer from "./AssessmentReducer";
import UploadReducer from "./UploadReducer";
import SettingReducer from "./SettingReducer";
import SuccessReducer from "./SuccessReducer";
import ErrorReducer from "./ErrorReducer";

export default combineReducers({
  auth: UserReducer,
  unitsCollection: UnitReducer,
  passwordMatters: AuthReducer,
  eventsCollection: EventReducer,
  classesCollection: ClassReducer,
  subjectsCollection: SubjectReducer,
  announcementsCollection: AnnouncementReducer,
  materialsCollection: MaterialReducer,
  tasksCollection: TasksReducer,
  assessmentsCollection: AssessmentReducer,
  filesCollection: UploadReducer,
  settingsCollection: SettingReducer,
  success: SuccessReducer,
  errors: ErrorReducer, // from null becomes false.
});
