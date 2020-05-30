import { UPLOAD_TUGAS } from "./Types";
import axios from 'axios';

export const uploadTugas = (tugas) => dispatch => {
  console.log("Hi")
  axios
    .post("/api/uploads/uploadtugas", tugas)
    .then(res => {
        console.log("Tugas berhasil di unggah")
        // console.log("Tugas yang diupload" , res.data);
        dispatch({
            type: UPLOAD_TUGAS,
            payload: res.data
        })
    })
    .catch(err => {
        console.log("Ada error")
        console.log(err);
    })
}
