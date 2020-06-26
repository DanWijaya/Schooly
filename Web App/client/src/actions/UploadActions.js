import { UPLOAD_TUGAS, GET_TUGAS, GET_FILE_BY_USER, GET_ALL_FILES_BY_USER, GET_ERRORS, GET_ALL_LAMPIRAN_BY_TASK } from "./Types";
import axios from "axios";

export const uploadTugas = (tugas, userData, taskId) => dispatch => {

  if(userData.role === "Student") {
    axios
        .post(`/api/uploads/uploadtugas/${userData.id}/${taskId}`, tugas)
        .then(res => {
            console.log("Run woi")
            window.location.reload()
        })
        .catch(err => {
            console.log("error in uploading")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
    }
}

export const deleteTugas = (tugas_id, userData) => {
    console.log("delete tugas is runned")

    if(userData.role === "Student") {
        axios
            .delete(`/api/uploads/tugas/${userData.id}/${tugas_id}/`)
            .then(res => {
                console.log("Tugas berhasil dibuang")
                window.location.reload()
            })
            .catch(err => {
                console.log("Error in deleting")
                console.log(err)
            })
    }
}

export const getTaskFilesByUser = (userId, tugasId) => dispatch => {
    console.log("getTaskFilesByUser is runned")
    axios
      .get(`/api/users/gettask/${userId}/${tugasId}`)
      .then(res => {
          console.log(res.data);
          dispatch({ 
            type: GET_FILE_BY_USER,
            payload: res.data
          })
      })
      .catch(err => {
        console.log("Error in retrieving the user tasks");
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      })
  }

export const getAllTaskFilesByUser = (userId) => dispatch => {
    console.log("getAllTaskFilesByUser is runned")
    axios
        .get(`/api/users/getalltask/${userId}`)
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: GET_ALL_FILES_BY_USER,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error in retrieving all of the user tasks");
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}
export const downloadTugas = (tugas_id, userData) => dispatch =>{
    console.log("Downloading Tugas")
    window.open(`http://localhost:5000/api/uploads/tugas/${tugas_id}` , "_blank")
    // Arsip dulu ini.. ternyata ndak perlu pakai axios karena getnya cuma muncul di reducer (kita kan gak perlu di reducer, cuma not really sure yet)
    // axios
    //     .get(`/api/uploads/tugas/${tugas_id}`)
    //     .then(res => {
    //         console.log("Tugas berhasil diunduh")
    //         // window.open(`http://localhost:5000/api/uploads/tugas/${tugas_id}` , "_blank")
    //         dispatch({
    //             type: GET_TUGAS,
    //             payload: res.data
    //         })
    //     })
    //     .catch(err => {
    //         console.log("Error in downloading")
    //         dispatch({
    //             type: GET_ERRORS,
    //             payload: err.response.data
    //         })
    //     })
}

export const previewTugas = (tugas_id) => dispatch => {
    console.log("Previewing Tugas")
    window.open(`http://localhost:5000/api/uploads/previewtugas/${tugas_id}`, "_blank") // previously has "_blank"
    // Arsip dulu ini.. ternyata ndak perlu pakai axios karena getnya cuma muncul di reducer (kita kan gak perlu di reducer, cuma not really sure yet)
    // axios
    //     .get(`/api/uploads/previewtugas/${tugas_id}`)
    //     .then(res => {
    //         console.log("Tugas berhasil di preview")
    //         window.open(`http://localhost:5000/api/uploads/previewtugas/${tugas_id}`, "_blank") // previously has "_blank"
    //         dispatch({
    //             type: GET_TUGAS,
    //             payload: res.data
    //         })
    //     })
    //     .catch(err => {
    //         console.log("Error in downloading")
    //         dispatch({
    //             type: GET_ERRORS,
    //             payload: err.response.data
    //         })
    //     })
}
// upload lampiran is handled togethe with createTask.
export const getAllLampiranByTask = (lampiran) => dispatch => {
    console.log("Get lampiran by task is runned")

    axios.get(`/api/uploads/all_lampiran_by_task/`, lampiran)
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: GET_ALL_LAMPIRAN_BY_TASK,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error in getting lampiran by tasks")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const downloadLampiran = (lampiran_id) => dispatch => {
    console.log("Downloading lampiran")
    window.open(`http://localhost:5000/api/uploads/lampiran/${lampiran_id}` , "_blank")
}

export const previewLampiran = (lampiran_id) => dispatch => {
    console.log("Previewing lampiran")
    window.open(`http://localhost:5000/api/uploads/previewlampiran/${lampiran_id}`, "_blank") // previously has "_blank"
}

export const deleteLampiran = (lampiran_to_delete, task_id)  => {
    console.log("Delete lampiran is runned")
    axios
        .delete(`/api/uploads/lampiran/${task_id}`, lampiran_to_delete)
        .then(res => console.log(res.data))
        .catch(err => {
            console.log("error in deleting lampiran file")
            console.log(err)
        })
}