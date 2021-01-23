import axios from "axios";
import { setCurrentUser } from "../UserActions";

export const uploadFileAssessment = (id, formData) => {
  console.log("uploading file Assessment actions");
  return axios.post(`/api/files/assessment/upload/${id}`, formData)
    .catch((err) => new Error(err));
};

export const getFileAssessment = (id) => (dispatch) => {
  return axios
    .get(`/api/files/assessment/by_user/${id}`)
    .then((res) => {
      console.log("assessmentnya: ", res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const downloadFileAssessment = (id) => (dispatch) => {
  return axios
    .get(`/api/files/assessment/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
      // let { file, filename} = res.data
      // let arraybuffer = Uint8Array.from(file.Body.data);
      // let blob=new Blob([arraybuffer], {type: file.ContentType});
      // let link=document.createElement('a');
      // link.href=window.URL.createObjectURL(blob);
      // link.download=filename;
      // link.click();
      // return link
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileAssessment = (id) => (dispatch) => {
  axios
    .get(`/api/files/assessment/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/assessment/${id}`)
};

export const deleteFileAssessment = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/assessment/${id}`, {
    data: { file_to_delete: file_to_delete, current_file: current_file },
  });
};
