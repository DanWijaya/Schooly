import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Submit Button
export const importUsers = (userData) => dispatch => {
  axios
    .post("/api/mockusers/importUsers", userData)
    .then(res => {
      // console.log(res.data);
      console.log("Data CSV telah tersimpan");
      // history.push("/masuk")
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR_INPUT",
        payload: err.response.data
      })
    }
  );
};

// Action Export/Download Button
export const exportUsers = (userData) => dispatch => {
    axios
      .get("/api/mockusers/exportUsers", userData)
      .then(res => {
        // history.push("/masuk")
      })
      .catch(err => {
        dispatch({
          type: "ERROR_EXPORT",
          payload: err.response.data
        })
      }
    );
  };


