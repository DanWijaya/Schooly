import { GET_SUBJECT, GET_ALL_SUBJECTS, GET_ALL_SUBJECTS_MAP } from "../actions/Types";

const initialState = {
    all_subjects: [],
    selectedSubjects:{},
    all_subjects_map: new Map(),
    subject: {}
};

export default function(state = initialState, action) {
  // kalau action kana da type sama payload(valuenya). 
  // type ini dipake untuk ngeatur reducernya state/data apa yang mau diubah.
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
          //action.payload dalam bentuk array
          let temp = new Map()
          // aku buat map object dengan key, value = id, name
          action.payload.map((subject) => temp.set(subject._id, subject.name))
          return{
            ...state,
            all_subjects_map: temp
          }
        default:
            return state;
    }
}
