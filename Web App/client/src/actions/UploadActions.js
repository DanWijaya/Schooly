import { UPLOAD_TUGAS } from "./Types";
import axios from 'axios';

export const uploadTugas = (tugas, userData) => dispatch => {
  console.log("uploadTugas is runned")

  if(userData.role == "Student") {
    axios
        .post(`/api/uploads/uploadtugas/${userData.id}`, tugas)
        .then(res => {
            console.log("Tugas berhasil di unggah")
        })
        .catch(err => {
            console.log("Ada error")
            console.log(err);
        })
    }
}

export const deleteTugas = (tugas_id, userData) => {
    console.log("delete tugas is runned")

    if(userData.role == "Student") {
        axios
            .delete(`/api/uploads/tugas/${userData.id}/${tugas_id}/`)
            .then(res => {
                console.log(res)
                console.log("Tugas berhasil dibuang")
            })
            .catch(err => {
                console.log("Ada Error")
                console.log(err)
            })
    }
}
