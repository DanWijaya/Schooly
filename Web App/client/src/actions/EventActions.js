import axios from "axios";
import { GET_ERRORS, GET_EVENT, GET_ALL_EVENTS } from "./Types";

export const createEvent = (formData, eventData) => {
  return axios
    .post("/api/events/create", eventData)
    .then((res) => {
      if (formData.has("lampiran_event")) {
        return axios.post(`/api/files/events/upload/${res.data}`, formData);
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      throw err.response.data;
    });
};

export const getAllEvents = (unitId) => (dispatch) => {
  axios
    .get(`/api/events/viewAll/${unitId}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_EVENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getOneEvent = (eventId) => (dispatch) => {
  axios
    .get(`/api/events/viewOne/${eventId}`)
    .then((res) => {
      dispatch({
        type: GET_EVENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const updateEvent = (
  formData,
  lampiran_to_delete,
  eventData,
  eventId
) => {
  // formData is the attachment files.
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
        // Call routes from api/files/fileEvents.js to DELETE the attachment.
        return axios.delete(`/api/files/events/${eventId}`, {
          data: { file_to_delete: lampiran_to_delete },
        });
      }
    })
    .then(() => {
      console.log("Update the lampiran files, upload some new lampiran files");
      console.log(
        formData.has("lampiran_event"),
        formData.getAll("lampiran_event")
      );
      if (formData.has("lampiran_event")) {
        console.log("Lampiran event going to be uploaded");
        // Call routes from api/files/fileEvents.js to UPLOAD the attachment.
        return axios.post(`/api/files/events/upload/${eventId}`, formData);
      }
    })
    .then(() => {
      console.log("Lampiran file is uploaded");
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      // dispatch({
      // 	type: GET_ERRORS,
      // 	payload: err.response.data,
      // });
      throw err.response.data;
    });
};

export const deleteEvent = (eventId) => {
  return axios
    .delete(`/api/events/delete/${eventId}`)
    .then(() => {
      // let lampiran_to_delete = Array.from(res.data.lampiran)
      // REVIEW call routes from api/files/file_events.js to DELETE all attachments.
      return axios.delete(`/api/files/events/all/${eventId}`);
    })
    .catch((err) => {
      console.log(err.response.data);
      throw err.response.data;
      // dispatch({
      // 	type: GET_ERRORS,
      // 	payload: err.response.data,
      // });
      // throw err;
    });
};
