import axios from "axios";

export const uploadFileAssessment = (id, formData) => {
  console.log("uploading file Assessment actions");
  return axios
    .post(`/api/files/assessments/upload/${id}`, formData)
    .catch((err) => new Error(err));
};

export const getFileAssessment = (id) => (dispatch) => {
  console.log(id);
  return axios
    .get(`/api/files/assessments/by_assessment/${id}`)
    .then((res) => {
      console.log("assessmentnya: ", res.data);
      let file_ids = res.data.map((file) => file._id);
      // file_ids = [...new Set(file_ids)]
      console.log(file_ids);
      return axios.post(`/api/files/assessments/getS3Url`, {
        file_ids: file_ids,
      });
    })
    .then((res) => {
      const { ids, urls } = res.data;
      // ids and urls will be got sorted.
      let idsToUrls = new Map();
      for (var i = 0; i < urls.length; i++) {
        idsToUrls.set(ids[i], urls[i]);
      }

      return idsToUrls;
    })
    .catch((err) => new Error(err));
};

export const downloadFileAssessment = (id) => (dispatch) => {
  return axios
    .get(`/api/files/assessments/download/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error("Error in getting S3 files"));
};

export const viewFileAssessment = (id) => (dispatch) => {
  axios
    .get(`/api/files/assessments/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/assessment/${id}`)
};

export const deleteFileAssessment = (id, file_to_delete, current_file) => {
  return axios.delete(`/api/files/assessments/${id}`, {
    data: { id_to_delete: file_to_delete, current_file: current_file },
  });
};
