import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Submit Button
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/mockusers/importUsers", userData)
    .then(res => {
      alert("Data CSV telah tersimpan")
      history.push("/masuk")
    })
    .catch(err => {
      dispatch({
        type: "ERROR_INPUT",
        payload: err.response.data
      })
    }
  );
};

// Lihat Isi Button
export const exportUser = (userData, history) => dispatch => {
    axios
      .get("/downloadCurrentUsersCSV", userData)
      .then(res => {
        history.push("/masuk")
      })
      .catch(err => {
        dispatch({
          type: "ERROR_EXPORT",
          payload: err.response.data
        })
      }
    );
  };

// Action Export/Download Button
export const exportUser = (userData, userId, history) => dispatch => {
  axios
      .get("/downloadCurrentUsersCSV", userData)
      .then(res => {
        history.push("/masuk")
      })
      .catch(err => {
        dispatch({
          type: "ERROR_EXPORT",
          payload: err.response.data
        })
      }
    );
}

