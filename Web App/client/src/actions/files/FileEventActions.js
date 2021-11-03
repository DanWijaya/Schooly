import axios from "axios";

export const uploadFileEvents = (id, formData) => {
  return axios.post(`/api/files/events/upload/${id}`, formData);
};

export const getFileEvents = (id) => {
  return axios
    .get(`/api/files/events/by_event/${id}`)
    .then((res) => {
      console.log("eventnya: ", res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const downloadFileEvent = (id) => {
  return axios
    .get(`/api/files/events/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileEvent = (id) => {
  axios
    .get(`/api/files/events/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
};

export const deleteFileEvent = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/events/${id}`, {
    data: { file_to_delete: file_to_delete, current_file: current_file },
  });
};
