import axios from "axios";
import {
	GET_ERRORS,
	GET_EVENT,
	GET_ALL_EVENTS,
} from "./Types";

export const createEvent = (formData, eventData) => {
	return axios
		.post("/api/events/create", eventData)
		.then((res) => {
			if (formData.has("lampiran_event")) {
				return axios.post(
					`/api/files/events/upload/${res.data}`, formData
				);
			}
		})
		.then((res) => {
			let success_res = res.data._id;
			return success_res;
		})
		.catch((err) => {
			console.log("Error happened");
			throw err.response.data;
		})

}

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

export const updateEvent = (
	formData,
	lampiran_to_delete,
	current_lampiran,
	eventData,
	eventId,
	history
) => (dispatch) => {
	// formData is the lampiran files
	return axios
		.put(`/api/events/update/${eventId}`, eventData)
		.then((res) => {
			console.log("Event updated to be :", res.data);
			console.log("Has lampiran? :", formData.has("lampiran_event"));
			// dispatch({
			// 	type: GET_ERRORS,
			// 	payload: false,
			// });
			if (lampiran_to_delete.length > 0) {
				//REVIEW panggil routes yang di api/files/file_events.js untuk DELETE lampiran.
				return axios.delete(`/api/files/events/${eventId}`, {
					data: { file_to_delete: lampiran_to_delete },
				});
			} else {
				return "No lampiran file is going to be deleted";
			}
		})
		.then((res) => {
			console.log("Update the lampiran files, upload some new lampiran files");
			console.log(
				formData.has("lampiran_event"),
				formData.getAll("lampiran_event")
			);
			if (formData.has("lampiran_event")) {
				console.log("Lampiran event going to be uploaded");
				//REVIEW panggil routes yang di api/files/file_events.js untuk UPLOAD lampiran.
				return axios.post(
					`/api/files/events/upload/${eventId}`,
					formData
				);
			}
		})
		.then((res) => {
			console.log("Lampiran file is uploaded");
			return true;
		})
		.catch((err) => {
			console.log("ERROR happen when editing");
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			});
			throw err.response.data;
		});
};

export const deleteEvent = (eventId, history = null) => (dispatch) => {
	return axios
		.delete(`/api/events/delete/${eventId}`)
		.then((res) => {
			// let lampiran_to_delete = Array.from(res.data.lampiran)
			//REVIEW panggil routes yang di api/files/file_events.js untuk DELETE semua lampiran.
			return axios.delete(`/api/files/events/${eventId}`);
		})
		.then((res) => {
			// if (history) {
			// 	history.push({
			// 		pathname: "/daftar-materi",
			// 		openDeleteSnackbar: true
			// 	})
			// }
			// console.log(res);
			// return true
			// window.location.href = "/daftar-materi";
		})
		.catch((err) => {
			console.log(err);
			throw err.response.data
			// dispatch({
			// 	type: GET_ERRORS,
			// 	payload: err.response.data,
			// });
			// throw err;
		});
};