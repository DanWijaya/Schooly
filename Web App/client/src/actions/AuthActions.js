import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING,
   GET_USERS, GET_STUDENTS, GET_TEACHERS } from "./Types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      alert("New User is registered successfully")
      history.push("/login")
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const updateUser = (userData, userId, formData, history) => dispatch => {
  axios
      .post("/api/users/update/" + userId, formData, userData)
      .then(res => {
        
          // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
        console.log("success")
        history.push("/profile")
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      })

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
        payload: err.response.data 
      })
    }
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  console.log(decoded)
  return {
    type: SET_CURRENT_USER,
    payload: decoded
    
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

export const getStudents = () => dispatch => {
  axios
      .get("/api/users/getstudents")
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_STUDENTS,
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
          type: GET_TEACHERS,
          payload: res.data
        })
      })
      .catch(err => {
        console.log("Error in getting all Teachers");
      })
}
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  console.log("test")
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
