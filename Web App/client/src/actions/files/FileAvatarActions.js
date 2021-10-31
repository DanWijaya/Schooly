import axios from "axios";
import { setCurrentUser } from "../UserActions";
import { GET_AVATAR } from "../Types";

export const uploadFileAvatar = (id, formData) => (dispatch) => {
  console.log("uploading file avatar actions");
  return axios
    .post(`/api/files/avatar/upload/${id}`, formData)
    .then((res) => {
      dispatch(setCurrentUser(res.data.user));
      return true;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};

export const getFileAvatar = (id) => (dispatch) => {
  return axios
    .get(`/api/files/avatar/by_user/${id}`)
    .then((res) => {
      dispatch({
        type: GET_AVATAR,
        payload: res.data,
      });
      console.log(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const getMultipleFileAvatar = (id_list) => (dispatch) => {
  console.log("Ini id listya: ", id_list);
  return axios
    .get(`/api/files/avatar/multiuser`, { params: { id_list: id_list } })
    .then((res) => {
      console.log(res);
      console.log("Multiple avatars:", res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const downloadFileAvatar = (id) => (dispatch) => {
  return axios
    .get(`/api/files/avatar/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileAvatar = (id) => (dispatch) => {
  axios
    .get(`/api/files/avatar/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/avatar/${id}`)
};

export const deleteFileAvatar = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/avatar/${id}`, {
    data: { file_to_delete: file_to_delete, current_file: current_file },
  });
};
