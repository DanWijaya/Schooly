import {
  GET_SUBJECT,
  GET_ALL_SUBJECTS,
  GET_ALL_SUBJECTS_MAP,
} from "../actions/Types";

const initialState = {
  school_subjects: [],
  all_subjects: [],
  selectedSubjects: {},
  all_subjects_map: new Map(),
  subject: {},
};

export default function (state = initialState, action) {
  // Action contains type and payload (value).
  // Type is used to manage state/data reducer that want to be changed.
  switch (action.type) {
    case GET_SUBJECT:
      return {
        ...state,
        subject: action.payload,
      };

    case GET_ALL_SUBJECTS:
      return {
        ...state,
        all_subjects: action.payload,
      };
    case GET_ALL_SUBJECTS_MAP:
      // action.payload in array form.
      let temp = new Map();
      // map object (key, value = id, name).
      action.payload.map((subject) => temp.set(subject._id, subject.name));
      return {
        ...state,
        all_subjects_map: temp,
      };
    default:
      return state;
  }
}
