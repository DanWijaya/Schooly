import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  GET_USERS,
  GET_ALL_STUDENTS,
  GET_ALL_TEACHERS,
  GET_ALL_ADMINS,
  GET_ALL_TEACHERS_MAP,
  GET_ONE_USER,
  GET_STUDENTS_BY_CLASS,
  GET_PENDING_STUDENTS,
  GET_PENDING_TEACHERS,
  GET_PENDING_ADMINS,
  // SET_DROPBOX_TOKEN,
  GET_SUCCESS_RESPONSE,
  GET_REGISTER_ERRORS,
  GET_ALL_USERS,
} from "./Types";

// Guide for UserActions.
/*
  If the get actions name contains "all" keywords like getAllObject, then get the object in the entire database.
  Otherwise, get the objects by unit.
*/

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  return axios
    .post("/api/users/register", userData)
    .then(() => {
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      return true; // Success
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data; // Fail
    });
};

export const updateUserData = (userData, userId, history) => (dispatch) => {
  console.log("update user data is runned");
  return axios
    .put("/api/users/update/data/" + userId, userData)
    .then((res) => {
      const { token } = res.data;
      console.log("Updating User Data");

      localStorage.setItem("jwtToken", token);
      console.log("Foto udah diganti");
      // Set token to Auth header.
      setAuthToken(token);
      // Decode token to get user data.
      const decoded = jwt_decode(token);
      // Set current user.
      dispatch(setCurrentUser(decoded));
      console.log("Successfully update user data");
      return true;
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });

      throw err;
    });
};

export const updateAvatar = (userData, userId, formData) => (dispatch) => {
  axios
    .put("/api/users/update/avatar/" + userId, formData)

    .then((res) => {
      // Set token to localStorage.
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      console.log("Foto udah diganti");
      // Set token to Auth header.
      setAuthToken(token);
      // Decode token to get user data.
      const decoded = jwt_decode(token);
      // Set current user.
      dispatch(setCurrentUser(decoded));
      if (Boolean(userData.avatar))
        return axios.delete(`/api/upload/avatar/${userData.avatar}`);
      else return "Old avatar does not exist";
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// To initiate a dispatch, pass the result to the dispatch() function.
// Login, get user token.
export const loginUser = (userData) => (dispatch) => {
  return axios
    .post("/api/users/login", userData)
    .then((res) => {
      console.log("Berhasil login");
      // Save to localStorage.
      // Set token to localStorage.
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header.
      setAuthToken(token);

      // Decode token to get user data.
      const decoded = jwt_decode(token);

      // Set current user.
      dispatch(setCurrentUser(decoded));
      return true;
    })
    .catch((err) => {
      console.log("error");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

// Log user out.
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage.
  localStorage.removeItem("jwtToken");
  // localStorage.removeItem("dropbox_token");
  // Remove auth header for future requests.
  setAuthToken(false);
  console.log("test");
  // Set current user to empty object {} which will set isAuthenticated to false.
  dispatch(setCurrentUser({}));
  // setDropboxToken(false);
  // if (history !== undefined)
  //   history.push("/masuk")
  window.location.href = "/masuk";
};

// Set logged in user.
export const setCurrentUser = (decoded) => {
  console.log("The role is: ", decoded.role);

  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading.
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const getStudents = (unitId) => (dispatch) => {
  return axios
    .get(`/api/users/getStudents/${unitId}`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_ALL_STUDENTS,
        payload: res.data,
      });
      console.log("getStudents completed");
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting all Students");
    });
};

export const getTeachers = (unitId, data = "array") => (dispatch) => {
  // console.log('getTeacher start')
  return axios
    .get(`/api/users/getTeachers/${unitId}`)
    .then((res) => {
      // console.log(res.data)
      if (data === "map") {
        let temp = new Map();
        res.data.map((teacher) => temp.set(teacher._id, teacher));
        dispatch({
          // type: GET_ALL_TEACHERS,
          type: GET_ALL_TEACHERS_MAP,
          payload: temp,
        });
        console.log("getTeacher completed");
        return temp;
      } else {
        dispatch({
          type: GET_ALL_TEACHERS,
          payload: res.data,
        });
        console.log("getTeacher completed");
        return res.data;
      }
    })
    .catch((err) => {
      console.log("Error in getting all Teachers");
    });
};

export const getAllUsers = (unitId) => (dispatch) => {
  return axios
    .get(`/api/users/getAllUsers/${unitId}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_USERS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting one user");
      throw err;
    });
};
export const getOneUser = (userId) => (dispatch) => {
  return axios
    .get("/api/users/getOneUser/" + userId)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_ONE_USER,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting one user");
      throw err;
    });
};

export const getUsers = (userIds) => (dispatch) => {
  return axios
    .get("/api/users/getUsers", { params: { userIds: userIds } })
    .then((res) => {
      console.log("These are the users: ", res.data);
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => console.log("Error in getting users"));
};

export const getStudentsByClass = (classId) => (dispatch) => {
  return axios
    .get("/api/users/getstudentsbyclass/" + classId)
    .then((res) => {
      // console.log(res.data)
      dispatch({
        type: GET_STUDENTS_BY_CLASS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

// Actions for administrators only.
export const getPendingStudents = (unitId) => (dispatch) => {
  return axios
    .get(`/api/users/getpendingstudents/${unitId}`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_PENDING_STUDENTS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getPendingTeachers = (unitId) => (dispatch) => {
  return axios
    .get(`/api/users/getpendingteachers/${unitId}`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_PENDING_TEACHERS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getAllAdmins = () => (dispatch) => {
  return axios
    .get(`/api/users/getAllAdmins/`)
    .then((res) => {
      dispatch({
        type: GET_ALL_ADMINS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getAdmins = (unitId) => (dispatch) => {
  return axios
    .get(`/api/users/getAdmins/${unitId}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_ADMINS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getAllPendingAdmins = () => (dispatch) => {
  console.log("Get pending users are runned");
  return axios
    .get("/api/users/getAllPendingAdmins")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_PENDING_ADMINS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const setUserActive = (userId) => (dispatch) => {
  return axios
    .put(`/api/users/setuseractive/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const bulkSetUserActive = (id_list) => (dispatch) => {
  let data = { id_list: id_list };
  return axios
    .put(`/api/users/bulksetuseractive/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const setUserDeactivated = (userId) => (dispatch) => {
  return axios
    .put(`/api/users/setuserdeactivated/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const bulkSetUserDeactivated = (id_list) => (dispatch) => {
  let data = { id_list: id_list };
  return axios
    .put(`/api/users/bulkSetUserDeactivated/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const deleteUser = (userId) => (dispatch) => {
  return axios
    .delete(`/api/users/delete/${userId}`)
    .then((res) => {
      return res.data;
    })
    .then((res) => {
      return axios.delete(`/api/files/avatar/${userId}`);
    })
    .catch((err) => {
      console.error("Error in deleting user");
      throw err;
    });
};

export const bulkDeleteUser = (id_list) => (dispatch) => {
  let data = { id_list: id_list };
  // For delete and get header, pass parameter must be like {data: data}
  return axios
    .delete(`/api/users/bulkDelete/`, { data: data })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
export const moveStudents = (data, dummyClassId) => {
  return axios
    .put(`/api/users/classAssignment/${dummyClassId}`, data)
    .then(() => {
      console.log("moveStudents completed");
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const updateTeacher = (data, teacherId) => (dispatch) => {
  axios
    .put(`/api/users/teacher/${teacherId}`, data)
    .then(() => {
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: teacherId,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const updateUnitAdmins = (data, adminId) => (dispatch) => {
  return axios
    .put(`/api/users/updateUnitAdmins`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const refreshTeacher = (teacherId) => (dispatch) => {
  if (teacherId) {
    axios
      .get("/api/users/getOneUser/" + teacherId)
      .then((res) => {
        dispatch(setCurrentUser(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export const bulkRegisterUsers = (data) => {
  return axios.post("/api/users/registerStudentsBulk", data).then((res) => {
    return res;
  });
};

export const validateRegister = (userData, pageNum) => {
  return axios
    .post(`api/users/validateregister/${pageNum}`, userData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err.response.data;
    });
};
