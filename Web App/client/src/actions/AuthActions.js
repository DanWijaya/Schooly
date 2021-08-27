import axios from "axios";
import {
  PWD_RESET_HASH_CREATED,
  GET_ERRORS,
  GET_SUCCESS_RESPONSE,
} from "./Types";

// SEND EMAIL TO API FOR HASHING
export const createHash = (email) => {
  return async (dispatch) => {
    // Contact the API

    await fetch(
      // Where to contact
      "/api/authentication/saveresethash",
      // What to send
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((json) => {
        console.log(json);
        if (json.success){
          // If email is in database
          dispatch({
            type: PWD_RESET_HASH_CREATED,
            payload: json,
          });
          return json;
        }
        else {
          console.log("errornya di sini");
          dispatch({
            type: GET_ERRORS,
            payload: json,
          });
          throw json;
        }
      })
      .catch((err) => {
        // If there is a problem email and mailgun service sending tke email (ex: email is not in recipient list)
        console.log("Mailgun has error in sending email");
        console.log(err, "Errornya ini");
        dispatch({
          type: GET_ERRORS,
          payload: err,
        });
        throw err;
      });
  };
};

// Save a user's password
export function savePassword(data) {
  return async (dispatch) => {
    // Contact the API
    await fetch(
      // Where to contact
      "/api/authentication/savepassword",
      // What to send
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return null;
      })
      .then(async (json) => {
        if (json && json.success) {
          alert("Selesai mengubah kata sandi");
          window.location.href = "/masuk";
        } else {
          if (json.expired === "yes") {
            alert("Tautan ini sudah tidak berlaku, silahkan memohon ulang");
            window.location.href = "/akun/lupa-katasandi";
          }
          return dispatch({
            type: GET_ERRORS,
            payload: json,
          });
        }
      })
      .catch((err) => {
        console.log(err, "Errornya ini");
        dispatch({
          type: GET_ERRORS,
          payload: err,
        });
      });
  };
}

export const changePassword = (passwordData, history) => (dispatch) => {
  axios
    .post("/api/authentication/changepassword", passwordData)
    .then((res) => {
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: true,
      });
    })
    .catch((err) => {
      console.log(err);
      if (Boolean(err.response)) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};
