import { UPLOAD_TUGAS } from "./Types";
import axios from "axios";

export const uploadTugas = (tugas, userData) => dispatch => {

  if(userData.role === "Student") {
    axios
        .post(`/api/uploads/uploadtugas/${userData.id}`, tugas)
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

export const downloadTugas = (tugas_id, userData) => {
    console.log("Downloading Tugas")

    axios
        .get(`/api/uploads/tugas/${tugas_id}`)
        .then(res => {
            console.log(res);
            console.log("Tugas berhasil diunduh")
        })
        .catch(err => {
            console.log("Error in downloading")
            console.log(err)
        })
}
