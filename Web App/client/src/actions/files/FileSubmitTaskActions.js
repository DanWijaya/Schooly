import axios from "axios";
import { GET_ERRORS, GET_SUCCESS_RESPONSE } from "../Types";

export const uploadFileSubmitTasks = (
  formData,
  task_id,
  author_id,
  task_deadline
) => (dispatch) => {
  console.log("uploadFileSubmitTasks di run");
  return axios
    .post(
      `/api/files/submit_tasks/upload/${task_id}&${author_id}&${task_deadline}`,
      formData
    )
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: res.data,
      });
      return "File Submit tasks is successfully uploaded";
    })
    .catch((err) => {
      throw err;
    });
};

export const getFileSubmitTasks_T = (task_id) => (dispatch) => {
  return axios
    .get(`/api/files/submit_tasks/by_task/${task_id}`)
    .then((res) => {
      console.log("Tasknya: ", res.data);
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getFileSubmitTasks_AT = (task_id, author_id) => (dispatch) => {
  //artinya mencari filesubmittasks by tasks and author
  return axios
    .get(`/api/files/submit_tasks/by_task_author/${task_id}&${author_id}`)
    .then((res) => {
      console.log("Tasknya: ", res.data);
      return res.data;
      // dispatch({
      //     type: GET_MATERIAL_FILES,
      //     payload: res.data
      // })
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
      throw new Error(err);
    });
};

export const getFileSubmitTasksByAuthor = (author_id) => {
  return axios.get(`/api/files/submit_tasks/by_author/${author_id}`);
};

export const downloadFileSubmitTasks = (id) => (dispatch) => {
  return axios
    .get(`/api/files/submit_tasks/download/${id}`)
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
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
      new Error("Error in getting S3 files");
    });
};

export const viewFileSubmitTasks = (id) => (dispatch) => {
  console.log(id);
  axios
    .get(`/api/files/submit_tasks/${id}`)
    .then((res) => {
      window.open(res.data);
      return res.data;
    })
    .catch((err) => new Error(err));
  // window.open(`http://${window.location.hostname}:5000/api/files/file_submit_tasks/${id}`)
};

export const deleteFileSubmitTasks = (id, delete_all = false) => (dispatch) => {
  return axios
    .delete(`/api/files/submit_tasks/${id}`, {
      data: { delete_all: delete_all },
    })
    .then((res) => {
      console.log(res.data);
      // dispatch({
      //   type: GET_SUCCESS_RESPONSE,
      //   payload: res.data,
      // });
      return "File submmited is deleted successfully";
      // window.location.reload();
    });
};
