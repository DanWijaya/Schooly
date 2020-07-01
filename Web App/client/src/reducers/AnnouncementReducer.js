import {GET_ALL_ANNOUNCEMENTS, GET_ANNOUNCEMENT} from "../actions/Types"

const initialState = {
    selectedAnnouncements: [],
    all_announcements: []
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_ALL_ANNOUNCEMENTS: {
            return {
            ...state,
            all_announcements: action.payload
            }
        }
        case GET_ANNOUNCEMENT: {
            return {
                ...state,
                selectedAnnouncements: action.payload
            }
        }
        default: 
            return state
    }
}