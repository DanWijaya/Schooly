import { UPLOAD_TUGAS, GET_TUGAS, GET_FILE_BY_USER, GET_ALL_FILES_BY_USER, GET_ERRORS } from "./Types";
import axios from "axios";

export const uploadLampiranTugas = () => {

}

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
            console.log(err);
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

    axios
        .get(`/api/uploads/tugas/${tugas_id}`)
        .then(res => {
            console.log("Tugas berhasil diunduh")
            window.open(`http://localhost:5000/api/uploads/tugas/${tugas_id}` , "_blank")
            dispatch({
                type: GET_TUGAS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error in downloading")
            console.log(err)
        })
}

export const previewTugas = (tugas_id) => dispatch => {
    console.log("Previewing Tugas")

    axios
        .get(`/api/uploads/previewtugas/${tugas_id}`)
        .then(res => {
            console.log("Tugas berhasil di preview")
            window.open(`http://localhost:5000/api/uploads/previewtugas/${tugas_id}`, "_blank") // previously has "_blank"
            dispatch({
                type: GET_TUGAS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error in downloading")
            console.log(err)
        })
}
