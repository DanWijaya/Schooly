import {
  GET_ALL_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT,
  GET_ADMIN_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT_BY_AUTHOR,
  GET_ANNOUNCEMENT_BY_CLASS,
} from "../actions/Types";

const initialState = {
  selectedAnnouncements: [],
  all_announcements: [],
  adminAnnouncements: [],
  announcementsByAuthor: [],
  announcementsByClass: [],
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
    case GET_ANNOUNCEMENT_BY_AUTHOR: {
      return {
        ...state,
        announcementsByAuthor: action.payload,
      };
    }
    case GET_ANNOUNCEMENT_BY_CLASS: {
      return {
        ...state,
        announcementsByClass: action.payload,
      };
    }
    default:
      return state;
  }
}
