import axios from "axios";
import {
  GET_ERRORS,
  GET_ALL_CLASSES,
  GET_ALL_CLASSES_MAP,
  GET_CLASSES,
  SET_CURRENT_CLASS,
  GET_SUCCESS_RESPONSE,
} from "./Types";

// Add Class
export const createClass = (classData, history) => (dispatch) => {
  console.log(classData);
  return axios
    .post("/api/classes/create", classData)
    .then((res) => {
      console.log(res.data);
      // history.push("/daftar-kelas");
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data._id,
      });
      return res.data._id;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

// View All Class
export const getAllClass = (unitId, data = "array") => (dispatch) => {
  // the id is unitId.
  return axios
    .get(`/api/classes/viewall/${unitId}`)
    .then((res) => {
      // console.log("Data should be here")
      if (data === "map") {
        dispatch({
          type: GET_ALL_CLASSES_MAP,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ALL_CLASSES,
          payload: res.data,
        });
        console.log("getAllClass(array) completed");
      }
      return res.data;
    })

    .catch((err) => {
      console.log(err, " Data should be here");
      throw err.response.data;
    });
};

export const getSelectedClasses = (classes_ids) => (dispatch) => {
  axios
    .get("/api/classes/viewSelectedClasses/", {
      params: { classes_ids: classes_ids },
    })
    .then((res) => {
      // console.log("Class to be edited");
      // dispatch(setCurrentClass(res.data))
      console.log(res);
      dispatch({
        type: GET_CLASSES,
        payload: res.data,
      });
      console.log("getSelectedClasses completed");
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
      // dispatch({
      //     type: GET_ERRORS,
      //     payload: err.response.data
      // })
    });
};

export const updateClass = (classData, classId, history) => (dispatch) => {
  return axios
    .put("/api/classes/update/" + classId, classData)
    .then((res) => {
      console.log("Class updated to be : ", res.data);
      // alert("Kelas telah berhasil disunting");
      // history.push("/daftar-kelas");
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: classId,
      });
      return classId;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const deleteClass = (classId, history) => (dispatch) => {
  return axios
    .delete("/api/classes/delete/" + classId)
    .then((res) => {
      return "Class is successfully deleted";
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err;
    });
};

export const setCurrentClass = (classId) => (dispatch) => {
  // console.log("set current class is runned")
  // sebelumnya tidak ada return
  return axios
    .get(`/api/classes/setCurrentClass/${classId}`)
    .then((res) => {
      dispatch({
        type: SET_CURRENT_CLASS,
        payload: res.data,
      });
      console.log("setCurrentClass completed");
      return res.data;
    })
    .catch((err) => {
      console.log(classId);
      console.log("error");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const unassignClassOfficers = (classesData) => {
  return axios
    .put("/api/classes/class-officers", classesData)
    .then(() => {
      console.log("unassignClassOfficers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const setHomeroomTeachers = (classesData) => {
  return axios
    .put("/api/classes/homeroom-teachers", classesData)
    .then(() => {
      console.log("setHomeroomTeachers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};
