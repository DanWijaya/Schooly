import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING,
   GET_USERS, GET_ALL_STUDENTS, GET_ALL_TEACHERS, 
   GET_ONE_USER, GET_STUDENTS_BY_CLASS,
   GET_PENDING_STUDENTS, GET_PENDING_TEACHERS} from "./Types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      alert("Akun baru telah terdaftar")
      history.push("/masuk")
    })
    .catch(err => {
      console.log(err)
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );

};

export const updateUserData = (userData, userId, history) => dispatch => {
  console.log("update user data is runned")
  axios
    .post("/api/users/update/data/" + userId, userData)
    .then(res => {

      const { token } = res.data;
      console.log("Updating User Data");

      localStorage.setItem("jwtToken", token);
      console.log("Foto udah diganti")
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      }
    )
    .catch(err => {
      console.log("jancuk la")
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}

export const updateAvatar = (userData, userId, formData) => dispatch => {
  if (Boolean(userData.avatar)) {
    axios.delete(`/api/upload/avatar/${userData.avatar}`)
      .then(res => {
        return axios.post("/api/users/update/avatar/" + userId, formData)
      })
      .then(res => {
        console.log("Old Profile picture is removed")
        // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        console.log("Foto udah diganti")
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));

      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      })
  }
  else {
      axios
        .post("/api/users/update/avatar/" + userId, formData, userData)
        .then(res => {
          // Set token to localStorage
          const { token } = res.data;
          localStorage.setItem("jwtToken", token);
          console.log("Foto udah diganti")
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          dispatch(setCurrentUser(decoded));

        })
        .catch(err => {
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        })
    }
  }

// to initiate a dispatch, pass the result to the dispatch() function.
// Login - get user token
export const loginUser = (userData) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      console.log("Berhasil login")
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

    })
    .catch(err => {
      console.log("error")
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    })
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  console.log("test")
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  // if (history !== undefined)
  //   history.push("/masuk")
  window.location.href ="./masuk"
};

// Set logged in user
export const setCurrentUser = decoded => {
  console.log("The role is: ", decoded.role)

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

export const getStudents = () => dispatch => {
  axios
    .get("/api/users/getstudents")
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_ALL_STUDENTS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("Error in getting all Students");
    })
}

export const getTeachers = () => dispatch => {
  axios
    .get("/api/users/getteachers")
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_ALL_TEACHERS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("Error in getting all Teachers");
    })
}

export const getOneUser = (userId) => dispatch => {
  axios
      .get("/api/users/getOneUser/" + userId)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_ONE_USER,
          payload: res.data
        })
      })
      .catch(err => {
        console.log("Error in getting one user")
      })
}

export const getUsers = (userIds) => dispatch => {
  axios
    .get("/api/users/getUsers", {params: {userIds: userIds}})
    .then(res => {
      console.log("These are the users: ", res.data)
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    })
    .catch(err => console.log("Error in getting users"))
}

export const getStudentsByClass = (classId) => dispatch => {
  axios
      .get("/api/users/getstudentsbyclass/" + classId)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_STUDENTS_BY_CLASS,
          payload: res.data
        })
      })
      .catch(err => {
        console.log("Error in getting Students by class");
      })
}

// actions for admin only
export const getPendingStudents = () => dispatch => {
  axios
      .get("/api/users/getpendingstudents/")
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_PENDING_STUDENTS,
          payload: res.data
        })
      })
      .catch(err => {
        console.log("Error in getting Students by class");
      })
}

export const getPendingTeachers = () => dispatch => {
  axios
      .get("/api/users/getpendingteachers/")
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_PENDING_TEACHERS,
          payload: res.data
        })
      })
      .catch(err => {
        console.log("Error in getting Students by class");
      })
}

export const setUserActive = (userId) => dispatch => {
  axios
      .post(`/api/users/setuseractive/${userId}`)
      .then(res => {
        console.log(res.data)
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
}

export const setUserDisabled = (userId) => dispatch => {
  axios
      .post(`/api/users/setuserdisabled/${userId}`)
      .then(res => {
        console.log(res.data)
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
}

export const deleteUser = (userId) => dispatch => {
  axios
      .delete(`/api/users/delete/${userId}`)
      .then(res => {
        console.log(res.data)
        window.location.reload()
      })
      .catch(err => {
        console.log("Error in deleting students")
      })
}