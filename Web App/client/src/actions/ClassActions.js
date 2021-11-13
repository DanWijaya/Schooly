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

export const removeMovedOfficers = (classesData) => {
  return axios
    .put("/api/classes/remove-moved-officers", classesData)
    .then(() => {
      console.log("removeMovedOfficers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const removeDisabledDeletedOfficers = (userIdList) => {
  if (!Array.isArray(userIdList)) {
    userIdList = [userIdList];
  }

  const data = { userIdList: userIdList };
  return axios
    .put("/api/classes/remove-disabled-deleted-officers", data)
    .then(() => {
      console.log("removeDisabledDeletedOfficers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};
export const setHomeroomTeachers = (classesData) => {
  // hteachers means Home room teachers
  return axios
    .put("/api/classes/set-hteachers", classesData)
    .then(() => {
      console.log("setHomeroomTeachers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const removeHomeroomTeachers = (userIdList) => {
  if (!Array.isArray(userIdList)) {
    userIdList = [userIdList];
  }
  // hteachers means Home room teachers
  const data = { userIdList: userIdList };
  return axios
    .put("/api/classes/remove-hteachers/", data)
    .then(() => {
      console.log("removeHomeroomTeachers completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};
