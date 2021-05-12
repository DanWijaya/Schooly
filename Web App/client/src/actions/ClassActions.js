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
  axios
    .post("/api/classes/create", classData)
    .then((res) => {
      console.log(res.data);
      // alert("Kelas telah dibuat");
      // history.push("/daftar-kelas");
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data._id,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// View All Class
export const getAllClass = (data = "array") => (dispatch) => {
  axios
    .get("/api/classes/viewall")
    .then((res) => {
      // console.log("Data should be here")
      if (data === "map") {
        dispatch({
          type: GET_ALL_CLASSES_MAP,
          payload: res.data,
        });
        console.log("getAllClass(map) completed");
      } else {
        dispatch({
          type: GET_ALL_CLASSES,
          payload: res.data,
        });
        console.log("getAllClass(array) completed");
      }
    })

    .catch((err) => {
      console.log(err, " Data should be here");
      // dispatch({
      //     type: GET_ERRORS,
      //     payload: err.response.data
      // })
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
      // res.send(classData);
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
  axios
    .post("/api/classes/update/" + classId, classData)
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
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteClass = (classId) => (dispatch) => {
  axios
    .delete("/api/classes/delete/" + classId)
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const setCurrentClass = (classId) => (dispatch) => {
  // console.log("set current class is runned")
  // sebelumnya tidak ada return
  return axios
    .get("/api/classes/setCurrentClass/" + classId)
    .then((res) => {
      // console.log("Class to be edited");
      // dispatch(setCurrentClass(res.data))
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
    });
  // return {
  //     type: SET_CURRENT_CLASS,
  //     payload: decoded,
  // }
};

export const updateClassAdmin = (classesData) => {
  return axios
    .post("/api/classes/bulkupdateclass", classesData)
    .then(() => {
      console.log("updateClassAdmin completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const updateWaliAdmin = (classesData) => {
  return axios
    .post("/api/classes/bulkupdatewali", classesData)
    .then(() => {
      console.log("updateWaliAdmin completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};
