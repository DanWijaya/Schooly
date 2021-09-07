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
  GET_SUCCESS_RESPONSE
} from "./Types";

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  return (
    axios
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
      })
  );
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
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      console.log("Successfully update user data")
      return true
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
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      console.log("Foto udah diganti");
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
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

// to initiate a dispatch, pass the result to the dispatch() function.
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  return axios
    .post("/api/users/login", userData)
    .then((res) => {
      console.log("Berhasil login");
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
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

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // localStorage.removeItem("dropbox_token");
  // Remove auth header for future requests
  setAuthToken(false);
  console.log("test");
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  // setDropboxToken(false);
  // if (history !== undefined)
  //   history.push("/masuk")
  window.location.href = "/masuk";
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  console.log("The role is: ", decoded.role);

  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const getStudents = () => (dispatch) => {
  axios
    .get("/api/users/getStudents")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_ALL_STUDENTS,
        payload: res.data,
      });
      console.log("getStudents completed");
    })
    .catch((err) => {
      console.log("Error in getting all Students");
    });
};

export const getTeachers = (data = "array") => (dispatch) => {
  // console.log('getTeacher start')
  return axios
    .get("/api/users/getTeachers")
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

export const getOneUser = (userId) => (dispatch) => {
  console.log(userId)
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
    });
};

export const getUsers = (userIds) => (dispatch) => {
  axios
    .get("/api/users/getUsers", { params: { userIds: userIds } })
    .then((res) => {
      console.log("These are the users: ", res.data);
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log("Error in getting users"));
};

export const getStudentsByClass = (classId) => (dispatch) => {
  axios
    .get("/api/users/getstudentsbyclass/" + classId)
    .then((res) => {
      // console.log(res.data)
      dispatch({
        type: GET_STUDENTS_BY_CLASS,
        payload: res.data,
      });
      console.log("getStudentsByClass completed");
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

// actions for admin only
export const getPendingStudents = () => (dispatch) => {
  axios
    .get("/api/users/getpendingstudents/")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_PENDING_STUDENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getPendingTeachers = () => (dispatch) => {
  axios
    .get("/api/users/getpendingteachers/")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_PENDING_TEACHERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in getting Students by class");
    });
};

export const getAllAdmins = () => (dispatch) => {
  axios.get("/api/users/getAdmins")
      .then((res) => {
        dispatch({
          type: GET_ALL_ADMINS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log("Error in getting Students by class");
      });
}

export const getPendingAdmins = () => (dispatch) => {
  console.log("Get pending users are runned");
  axios.get("/api/users/getpendingadmins")
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: GET_PENDING_ADMINS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log("Error in getting Students by class");
      });
}

export const setUserActive = (userId) => (dispatch) => {
  axios
    .put(`/api/users/setuseractive/${userId}`)
    .then((res) => {
      console.log(res.data);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setUserDisabled = (userId) => (dispatch) => {
  axios
    .put(`/api/users/setuserdisabled/${userId}`)
    .then((res) => {
      console.log(res.data);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteUser = (userId) => (dispatch) => {
  axios
    .delete(`/api/users/delete/${userId}`)
    .then((res) => {
      console.log(res.data);
      window.location.reload();
    })
    .catch((err) => {
      console.log("Error in deleting students");
    });
};

export const moveStudents = (data, dummyClassId) => {
  return axios
    .put(`/api/users/class-assignment/${dummyClassId}`, data)
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
        payload: teacherId
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const refreshTeacher = (teacherId) => (dispatch) => {
  axios
  .get("/api/users/getOneUser/" + teacherId)
  .then((res) => {
    dispatch(setCurrentUser(res.data));
  })
  .catch((err) => {
    console.log(err);
  });    
};

export const bulkRegisterUsers = (data) => {
  return (
    axios
      .post("/api/users/register_students_bulk", data)
      .then((res) => {
        return res;
      })
  )
}