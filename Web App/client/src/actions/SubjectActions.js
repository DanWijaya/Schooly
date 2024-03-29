import axios from "axios";
import {
  GET_SUBJECT,
  GET_ALL_SUBJECTS,
  GET_ERRORS,
  GET_ALL_SUBJECTS_MAP,
  GET_SUCCESS_RESPONSE,
} from "./Types";

export const getSubject = (subjectId) => (dispatch) => {
  axios
    .get(`/api/subjects/view/${subjectId}`, subjectId)
    .then((res) => {
      console.log("Run get one Subject");
      dispatch({
        type: GET_SUBJECT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in retrieving one subject");
      dispatch({
        type: GET_SUBJECT,
        payload: err.response.data,
      });
    });
};

export const getAllSubjects = (unitId, data = "array") => (dispatch) => {
  return axios
    .get(`/api/subjects/viewall/${unitId}`)
    .then((res) => {
      // console.log("Run get all subjects")
      if (data !== "map") {
        dispatch({
          type: GET_ALL_SUBJECTS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ALL_SUBJECTS_MAP,
          payload: res.data,
        });
      }
      return res.data;
    })
    .catch((err) => {
      console.log(err, "Error in retrieving all subjects");
    });
};
export const createSubject = (subjectData) => (dispatch) => {
  // router.post()
  return axios
    .post("/api/subjects/create", subjectData)
    .then((res) => {
      console.log("Run create subject");
      // window.location.reload();
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const deleteSubject = (subjectId) => (dispatch) => {
  return axios
    .delete(`/api/subjects/delete/${subjectId}`)
    .then((res) => {
      return "Subject is successfully deleted";
      // window.location.reload();
    })
    .catch((err) => {
      console.log(err, "Error in deleting the subject");
    });
};
export const editSubject = (subjectData) => (dispatch) => {
  return axios
    .put(`/api/subjects/edit/${subjectData.id}`, subjectData)
    .then((res) => {
      console.log("Edited subject", res.data);
      // window.location.reload();
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log(err, "Error in editing the subject");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};
