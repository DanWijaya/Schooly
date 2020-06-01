import { UPLOAD_TUGAS } from "./Types";
import axios from 'axios';

export const uploadTugas = (tugas, userData) => dispatch => {
  console.log("uploadTugas is runned")

  if(userData.role == "Student") {

    axios
        .post(`/api/uploads/uploadtugas/${userData.id}`, tugas)
        .then(res => {
            console.log("Tugas berhasil di unggah")
            // console.log("Tugas yang diupload" , res.data);
            // dispatch({
            //     type: UPLOAD_TUGAS,
            //     payload: res.data
            // })
        })
        .catch(err => {
            console.log("Ada error")
            console.log(err);
        })
    }
}
