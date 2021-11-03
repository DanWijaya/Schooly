import axios from "axios";
import { GET_SETTING, GET_ERRORS, GET_SUCCESS_RESPONSE } from "./Types";

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
};

export const getSetting = () => (dispatch) => {
  return axios
    .get("/api/settings/view")
    .then((res) => {
      console.log("Run get setting");
      dispatch({
        type: GET_SETTING,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error in retrieving setting");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const editSetting = (bodyData) => (dispatch) => {
  return axios
    .put("/api/settings/update", bodyData)
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
};
