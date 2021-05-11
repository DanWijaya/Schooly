import {
  GET_ALL_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT,
  GET_ADMIN_ANNOUNCEMENTS,
} from "../actions/Types";

const initialState = {
  selectedAnnouncements: [],
  all_announcements: [],
  adminAnnouncements: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_ANNOUNCEMENTS: {
      return {
        ...state,
        all_announcements: action.payload,
      };
    }
    case GET_ANNOUNCEMENT: {
      return {
        ...state,
        selectedAnnouncements: action.payload,
      };
    }
    case GET_ADMIN_ANNOUNCEMENTS: {
      return {
        ...state,
        adminAnnouncements: action.payload,
      };
    }
    default:
      return state;
  }
}
