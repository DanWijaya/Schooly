import axios from "axios";

export const uploadFileMaterials = (id, formData) => {
  return axios.post(`/api/files/materials/upload/${id}`, formData);
};

export const getFileMaterials = (id) => (dispatch) => {
  return axios
    .get(`/api/files/materials/by_material/${id}`)
    .then((res) => {
      console.log("Materialnya: ", res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const downloadFileMaterial = (id) => (dispatch) => {
  return axios
    .get(`/api/files/materials/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileMaterial = (id) => (dispatch) => {
  axios
    .get(`/api/files/materials/${id}`)
    .then((res) => {
      window.open(res.data);
      // window.location.assign(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/materials/${id}`)
};

export const deleteFileMaterial = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/materials/${id}`, {
    data: { file_to_delete: file_to_delete, current_file: current_file },
  });
};
