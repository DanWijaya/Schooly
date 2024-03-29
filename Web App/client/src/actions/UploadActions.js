import axios from "axios";
import { Dropbox } from "dropbox";
import {
  GET_FILE_BY_USER,
  GET_ALL_FILES_BY_USER,
  GET_ALL_MATERIALS,
  GET_ALL_LAMPIRAN_BY_TASK,
  GET_SUCCESS_RESPONSE,
  GET_ERRORS,
} from "./Types";

export const uploadTugas = (tugas, userData, taskId, ontime) => (dispatch) => {
  if (userData.role === "Student") {
    axios
      .post(
        `/api/upload/file_tugas/uploadtugas/${userData._id}/${taskId}/${ontime}`,
        tugas
      )
      .then((res) => {
        dispatch({
          type: GET_SUCCESS_RESPONSE,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log("error in uploading");
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  }
};

export const getTaskFilesByUser = (userId, tugasId) => (dispatch) => {
  console.log("getTaskFilesByUser is runned");
  axios
    .get(`/api/users/gettask/${userId}/${tugasId}`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_FILE_BY_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in retrieving the user tasks");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getAllTaskFilesByUser = (userId) => (dispatch) => {
  // console.log("getAllTaskFilesByUser is runned")
  // console.log("User ID: ", userId)
  axios
    .get(`/api/users/getalltask/${userId}`)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: GET_ALL_FILES_BY_USER,
        payload: res.data,
      });
      console.log("getAllTaskFilesByUser completed");
    })
    .catch((err) => {
      console.log("Error in retrieving all of the user tasks");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const downloadTugas = (tugas_id, userData) => (dispatch) => {
  console.log("Downloading Tugas");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/file_tugas/tugas/${tugas_id}`,
    "_blank"
  );
};

export const previewTugas = (tugas_id) => (dispatch) => {
  console.log("Previewing Tugas");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/file_tugas/previewtugas/${tugas_id}`,
    "_blank"
  ); // Previously has "_blank".
};

export const moveToDropbox = (dropbox_token, tugas_ids) => (dispatch) => {
  console.log(dropbox_token, tugas_ids);
  axios
    .get("/api/upload/file_tugas/", { params: { tugas_ids: tugas_ids } })
    .then((res) => {
      console.log(res.data);
      let files = res.data;
      // for (var i = 0; i < files.length; i++){
      // window.open(`http://${window.location.hostname}:5000/api/upload/file_tugas/download/${files[0]._id}`)
      // }

      let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });

      const promises = files.map((file) =>
        dropbox.filesUpload({
          path: "/TUGAS/" + file.filename,
          contents: file,
        })
      );

      Promise.all(promises)
        .then((responses) => {
          console.log(responses);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

// Upload attachment is handled together with createTask.
export const getAllLampiranByTask = (lampiran) => (dispatch) => {
  console.log("Get lampiran by task is runned");

  axios
    .get(`/api/upload/file_tugas/all_lampiran_by_task/`, lampiran)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_ALL_LAMPIRAN_BY_TASK,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in getting lampiran by tasks");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const downloadLampiran = (lampiran_id) => (dispatch) => {
  console.log("Downloading lampiran");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_task/lampiran/${lampiran_id}`,
    "_blank"
  );
};

export const previewLampiran = (lampiran_id) => (dispatch) => {
  console.log("Previewing lampiran");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_task/preview/${lampiran_id}`,
    "_blank"
  );
};

export const deleteLampiran = (lampiran_to_delete, task_id) => {
  console.log("Delete lampiran is runned");
  axios
    .delete(`/api/upload/att_task/lampiran/${task_id}`, lampiran_to_delete)
    .then((res) => console.log(res.data))
    .catch((err) => {
      console.log("error in deleting lampiran file");
      console.log(err);
    });
};

// Deal with attachments in Announcement.
export const downloadLampiranAnnouncement = (lampiran_id) => (dispatch) => {
  console.log("Downloading lampiran");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_announcement/lampiran/${lampiran_id}`,
    "_blank"
  );
};

export const previewLampiranAnnouncement = (lampiran_id) => (dispatch) => {
  console.log("Previewing lampiran");
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_announcement/preview/${lampiran_id}`,
    "_blank"
  ); // Previously has "_blank".
};

export const deleteLampiranAnnouncement = (lampiran_to_delete, task_id) => {
  console.log("Delete lampiran is runned");
  axios
    .delete(
      `/api/upload/att_announcement/lampiran/${task_id}`,
      lampiran_to_delete
    )
    .then((res) => console.log(res.data))
    .catch((err) => {
      console.log("error in deleting lampiran file");
      console.log(err);
    });
};

// Deal with attachments in Material.
export const downloadLampiranMateri = (materi_id) => (dispatch) => {
  console.log("Downloading lampiran", materi_id);
  console.log(materi_id);
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_material/lampiran_materi/${materi_id}`,
    "_blank"
  );
};

export const previewLampiranMateri = (materi_id) => (dispatch) => {
  console.log("Previewing lampiran");
  console.log(materi_id);
  window.open(
    `http://${window.location.hostname}:5000/api/upload/att_material/previewlampiran_materi/${materi_id}`,
    "_blank"
  );
};
