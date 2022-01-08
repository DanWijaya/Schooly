import axios from "axios";
import {
  GET_ERRORS,
  GET_ALL_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT,
  GET_SUCCESS_RESPONSE,
  GET_ADMIN_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT_BY_CLASS,
  GET_ANNOUNCEMENT_BY_AUTHOR,
} from "./Types";

// Add Announcement
export const createAnnouncement = (formData, announcementData, history) => (
  dispatch
) => {
  return axios
    .post("/api/announcements/create", announcementData)
    .then((res) => {
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (formData.has("lampiran_announcement")) {
        return axios.post(
          `/api/files/announcements/upload/${res.data._id}`,
          formData
        );
      } else return res;
    })
    .then((res) => {
      console.log(res);
      let success_res = res.data._id;
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: success_res,
      });
      return success_res;
    })
    .catch((err) => {
      console.log("error happened");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const getAllAnnouncements = (userId) => (dispatch) => {
  axios.get(`/api/announcements/viewall/${userId}`).then((res) => {
    console.log("Announcement data is received");
    dispatch({
      type: GET_ALL_ANNOUNCEMENTS,
      payload: res.data,
    });
  });
};

export const getAnnouncementByClass = (classId, studentId) => (dispatch) => {
  return axios
    .get(`/api/announcements/viewByClass`, {
      params: { classId: classId, studentId: studentId },
    })
    .then((res) => {
      console.log("Announcement by class is received");
      dispatch({
        type: GET_ANNOUNCEMENT_BY_CLASS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};

export const getAnnouncementByAuthor = (authorId) => (dispatch) => {
  return axios
    .get(`/api/announcements/view/${authorId}`)
    .then((res) => {
      console.log("Announcement datas are received");
      dispatch({
        type: GET_ANNOUNCEMENT_BY_AUTHOR,
        payload: res.data,
      });
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};

export const getAdminAnnouncements = (unitId) => (dispatch) => {
  console.log("Run admin announcement", unitId);
  return axios
    .get(`/api/announcements/viewAdmin/${unitId}`)
    .then((res) => {
      console.log("getAdminAnnouncements completed");
      dispatch({
        type: GET_ADMIN_ANNOUNCEMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err);
    });
};

export const deleteAnnouncement = (
  announcementId,
  history = null,
  lampiran_to_delete = null
) => (dispatch) => {
  return axios
    .delete(`/api/announcements/delete/${announcementId}`)
    .then((res) => {
      console.log("Deleted: ", res.data);
      return axios.delete(`/api/files/announcements/all/${announcementId}`);
    })
    .then((res) => {
      console.log(res);
      if (history) {
        history.push({
          pathname: "/daftar-pengumuman",
          openDeleteSnackbar: true,
        });
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err;
    });
};
export const getOneAnnouncement = (annId) => (dispatch) => {
  console.log("run getOneAnnoucnement");
  axios
    .get(`/api/announcements/viewOne/${annId}`)
    .then((res) => {
      console.log("Announcement datas are received");
      dispatch({
        type: GET_ANNOUNCEMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};

export const updateAnnouncement = (
  formData,
  lampiran_to_delete,
  current_lampiran,
  annData,
  annId,
  history
) => (dispatch) => {
  // formData is the attachment files.
  return axios
    .put(`/api/announcements/update/${annId}`, annData)
    .then((res) => {
      console.log("Task updated to be :", res.data);
      console.log("Has lampiran? :", formData.has("lampiran_announcement"));
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      console.log("From actions: ", lampiran_to_delete);
      if (lampiran_to_delete.length > 0) {
        return axios.delete(`/api/files/announcements/${annId}`, {
          data: { file_to_delete: lampiran_to_delete },
        });
      } else {
        return "No lampiran file is going to be deleted";
      }
    })
    .then((res) => {
      console.log("Update the lampiran files, upload some new lampiran files");
      if (formData.has("lampiran_announcement")) {
        console.log("Lampiran announcement going to be uploaded");
        return axios.post(`/api/files/announcements/upload/${annId}`, formData);
      } else return "Successfully updated task with no lampiran";
    })
    .then((res) => {
      console.log("Lampiran file is uploaded");
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: true,
      });
      return true;
    })

    .catch((err) => {
      console.log("ERROR happen when editing");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};
