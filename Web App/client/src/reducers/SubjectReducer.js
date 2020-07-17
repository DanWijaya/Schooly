import { GET_SUBJECT, GET_ALL_SUBJECTS, GET_ALL_SUBJECTS_MAP } from "../actions/Types";

const initialState = {
    all_subjects: [],
    selectedSubjects:{},
    all_subjects_map: new Map(),
    subject: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_SUBJECT:
            return{
                ...state,
                subject: action.payload
            };

        case GET_ALL_SUBJECTS:
            return{
                ...state,
                all_subjects: action.payload
            };
        case GET_ALL_SUBJECTS_MAP:
          let temp = new Map()
          action.payload.map((subject) => temp.set(subject._id, subject.name))
          return{
            ...state,
            all_subjects_map: temp
          }
        default:
            return state;
    }
}
