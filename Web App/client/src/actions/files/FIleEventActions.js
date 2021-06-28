import axios from "axios";

// TESTING DENGAN S3

export const uploadFileEvents = (id, formData) => {
  return axios.post(`/api/files/events/upload/${id}`, formData);
};

export const getFileEvents = (id) => (dispatch) => {
  return axios
    .get(`/api/files/events/by_event/${id}`)
    .then((res) => {
      console.log("eventnya: ", res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const downloadFileEvent = (id) => (dispatch) => {
  return axios
    .get(`/api/files/events/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileEvent= (id) => (dispatch) => {
  axios
    .get(`/api/files/events/${id}`)
    .then((res) => {
      window.open(res.data);
      // window.location.assign(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/events/${id}`)
};

export const deleteFileEvent = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/events/${id}`, {
    data: { file_to_delete: file_to_delete, current_file: current_file },
  });
};
