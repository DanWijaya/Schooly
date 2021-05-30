import { 
	GET_EVENT, 
	GET_ALL_EVENTS, 
	// GET_EVENTS_BY_AUTHOR
} from "../actions/Types";

const initialState = {
	selectedEvent: {},
	eventsByAuthor: [],
	allEvents: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_ALL_EVENTS: {
			return {
				...state,
				allEvents: action.payload
			};
		}

		// case GET_EVENTS_BY_AUTHOR: {
		// 	return {
		// 		...state,
		// 		eventsByAuthor: action.payload,
		// 	};
		// }

		case GET_EVENT: {
			return {
				...state,
				selectedEvent: action.payload
			};
		}

		default:
			return state;
	}
}
