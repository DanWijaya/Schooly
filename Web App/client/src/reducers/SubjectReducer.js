import { GET_SUBJECT, GET_ALL_SUBJECTS } from "../actions/Types"
const initialState = {
    all_subjects: [],
    subject:{}
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

        default: 
            return state;
    }
}