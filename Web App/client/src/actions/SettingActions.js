// Kamu harus buat actions typenya dulu di Types.js
// ikutin format, import" axios. 
// pakai axios dkk buat post, get dan put request. Jangan lupa panggil res.json atau res.status(<status_code>).json({..})
// FUnctionality yang dipakai user hanya get dan put sih
// Di dalamnya, kamu pakai Setting.findById dan kawan"... ikutin saja. 

import {
  GET_SETTING, 
  GET_ERRORS,
  GET_SUCCESS_RESPONSE,
} from "./Types";
import axios from "axios";

export const createSetting = (settingData) => (dispatch) => {
  return axios
    .post("/api/settings/create", settingData)
    .then((res) => {
      console.log("Run create setting");
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
}

export const getSetting = () => (dispatch) => {
  console.log("running getsetting");
  return axios
    .get("/api/settings/view")
    .then((res) => {
      console.log(res);
      console.log("Run get setting");
      dispatch({
        type: GET_SETTING,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in retrieving setting");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    })
}

export const editSetting = (settingData) => (dispatch) => {
  return axios
    .put("/api/settings/update")
    .then((res) => {
      console.log("Edited setting", res.data);
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log(err, "Error in editing the setting");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
}