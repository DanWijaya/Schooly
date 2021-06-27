import axios from "axios";
import {
	GET_ERRORS,
	GET_EVENT,
	GET_ALL_EVENTS,
	// GET_EVENTS_BY_AUTHOR
} from "./Types";

export const createEvent = (eventData) => {
	return axios
	.post("/api/events/create", eventData)
	.catch((err) => {
		throw err.response.data;
	});
};

export const getAllEvents = () => (dispatch) => {
	axios.get("/api/events/viewAll").then((res) => {
		dispatch({
			type: GET_ALL_EVENTS,
			payload: res.data
		});
	}).catch((err) => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
};

export const getOneEvent = (eventId) => (dispatch) => {
	axios.get(`/api/events/viewOne/${eventId}`).then((res) => {
		dispatch({
			type: GET_EVENT,
			payload: res.data
		});
	}).catch((err) => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
};

// export const getEventsByAuthor = (authorId) => (
// 	dispatch
// ) => {
// 	axios.get(`/api/events/viewByAuthor/${authorId}`).then((res) => {
// 		dispatch({
// 			type: GET_EVENTS_BY_AUTHOR,
// 			payload: res.data
// 		});
// 	}).catch((err) => {
// 		dispatch({
// 			type: GET_ERRORS,
// 			payload: err.response.data
// 		});
// 	});
// };

export const updateEvent = (eventData, eventId) => {
	return axios
		.put(`/api/events/update/${eventId}`, eventData)
		.catch((err) => {
			throw err.response.data;
		});
};

export const deleteEvent = (eventId) => {
	return axios
		.delete(`/api/events/delete/${eventId}`)
		.catch(() => {
			throw new Error("deleteEvent error has occured");
		});
};