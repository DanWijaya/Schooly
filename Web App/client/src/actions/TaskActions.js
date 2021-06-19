import axios from "axios";
import {
  GET_ALL_TASKS,
  GET_ERRORS,
  GET_SUCCESS_RESPONSE,
  GET_TASKS_BY_CLASS,
} from "./Types";
import { BrowserRouter } from "react-router-dom"
import {deleteFileSubmitTasks} from "./files/FileSubmitTaskActions";

// import Dropbox from "dropbox";

// Add Task
export const createTask = (formData, taskData, history) => (dispatch) => {
  return axios
    .post("/api/tasks/create", taskData)
    .then((res) => {
      console.log("this is the res", res.data._id);
      console.log("Will run this");
      console.log(formData.has("lampiran_tugas"));
      // dispatch action. Ada dua atribut. type dan payload
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (formData.has("lampiran_tugas")) {
        return axios.post(`/api/files/tasks/upload/${res.data._id}`, formData);
      } // Must return something, if false it won't continue to the next "then"
      else
        return {
          _id: res.data._id,
          message: "Successfully created task with no lampiran",
        };
    })
    .then((res) => {
      console.log("Lampiran tugas is uploaded");
      console.log(res);
      let success_res = res.data ? res.data._id : res._id;
      // dispatch({
      //   type: GET_SUCCESS_RESPONSE,
      //   payload: success_res,
      // });
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

// View All Task
export const getAllTask = () => (dispatch) => {
  axios
    .get("/api/tasks/viewall")
    .then((res) => {
      dispatch({
        type: GET_ALL_TASKS,
        payload: res.data,
      });
      console.log("getAllTask completed");
    })
    .catch((err) => {
      console.log("Error has occured");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
  // .catch((err) => {
  //   console.log("Error has occured");
  //   dispatch({
  //     type: GET_ERRORS,
  //     payload: err.response.data,
  //   });
  // });
};

// View One Task
export const getOneTask = (taskId) => (dispatch) => {
  return axios
    .get("/api/tasks/view/" + taskId)
    .then((res) => {
      console.log("Task to be received: ", res.data);
      dispatch({
        type: GET_ALL_TASKS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("error");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const updateTask = (
  formData,
  lampiran_to_delete,
  current_lampiran,
  taskData,
  taskId,
  history
) => (dispatch) => {
  // formData is the lampiran files
  return axios
    .post(`/api/tasks/update/${taskId}`, taskData)
    .then((res) => {
      console.log("Task updated to be :", res.data);
      console.log("Has lampiran? :", formData.has("lampiran_tugas"));
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (lampiran_to_delete.length > 0)
        // axios.delete put the data is quite different..
        // return axios.delete(`/api/upload/att_task/lampiran/${taskId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        return axios.delete(`/api/files/tasks/${taskId}`, {
          data: { file_to_delete: lampiran_to_delete },
        });
      else return "No lampiran file is going to be deleted";
    })
    .then((res) => {
      if (formData.has("lampiran_tugas"))
        return axios.post(`/api/files/tasks/upload/${taskId}`, formData);
      // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
      else return "Successfully updated task with no lampiran";
    })
    .then((res) => {
      console.log("Lampiran file is uploaded");
      // dispatch({
      //   type: GET_SUCCESS_RESPONSE,
      //   payload: true,
      // });
      return true;
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const gradeTask = (taskId, gradingData, student_name) => (dispatch) => {
  console.log(gradingData);
  axios
    .post(`/api/tasks/grade/${taskId}`, gradingData)
    .then((res) => {
      console.log("Grade task is added");
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: [true, gradingData.grade, student_name],
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};
export const deleteTask = (taskId, history=null) => (dispatch) => {
  return axios
    .delete("/api/tasks/delete/" + taskId)
    .then((res) => {
      return axios
        .delete(`/api/files/tasks/${taskId}`, { data: { delete_all: true}})
    })
    .then((res) => {
      return axios
    .delete(`/api/files/submit_tasks/${taskId}`, {
      data: { delete_all: true }})
    })
    .then((res) => {
      if(history){
        history.push({
          pathname: "/daftar-tugas",
          openDeleteSnackbar: true 
        })
      }
      return true
      // window.location.href = "/daftar-tugas";
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

export const getTasks = (subjectId, classId) => {
  return axios
    .get(`/api/tasks/view`, { params: { subjectId, classId } })
    .then((res) => {
      console.log("getTasks completed");
      return res.data;
    })
    .catch(() => {
      throw new Error("getTasks error has occured");
    });
};

export const getTaskAtmpt = (user_id) => (dispatch) => {
  return axios
    .get(`/api/files/submit_tasks/noatmpt/${user_id}`)
    .then((res) => {
      console.log("getTaskAtmpt completed");
      console.log(res.data);
      return res.data;
    })
    .catch(() => {
      throw new Error("getTaskAtmpt error has occured");
    });
};

/* export const getTaskByClass = (classId) => (dispatch) => {
  axios.get(`/api/tasks/byclass/${classId}`).then((res) => {
    console.log(res.data);
    dispatch({
      type: GET_TASKS_BY_CLASS,
      payload: res.data,
    });
    return res.data;
  });
}; */

export const createTaskComment = (
  taskId,
  comment
) => {
  return axios
    .post(`/api/tasks/comment/${taskId}`, comment)
    .catch(() => {
      throw new Error("createTaskComment error has occured");
    });
};

export const editTaskComment = (
  taskId,
  updatedContent,
  commentId
) => {
  return axios
    .put(`/api/tasks/comment/${taskId}`, { updatedContent, commentId })
    .catch(() => {
      throw new Error("editTaskComment error has occured");
    });
};

export const deleteTaskComment = (
  taskId,
  commentId
) => {
  return axios
    .delete(`/api/tasks/comment/${taskId}&${commentId}`)
    .catch(() => {
      throw new Error("deleteTaskComment error has occured");
    });
};
