import axios from "axios";
import { GET_ERRORS } from "./Types"

// Add Announcement
export const createAnnouncement = (formData, announcementData, history) => dispatch => {
    console.log("RUnLAH!!", formData, announcementData)
    axios
      .post("/api/announcements/create", announcementData)
      .then(res => {
          console.log("this is the res" , res.data._id)
          console.log("Will run this")
          console.log(formData.has('lampiran'))
          if(formData.has('lampiran_announcement'))
              return axios.post(`/api/uploads/upload_lampiran_annoucement/${res.data._id}`, formData);
          else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya.. 
              return "Successfully created announcement with no lampiran"
      })
      .then(res => {
              alert("Announcement is created")
            //   history.push("/daftar-tugas")
          })
      .catch(err =>{
          console.log("error happened")
          dispatch({
              type: GET_ERRORS,
              payload: err
          })
      })  
} 

export const deleteAnnouncement = (announcementId, history) => dispatch => {
    axios
        .delete(`/api/announcements/delete/${announcementId}`)
        .then((res) => {
            console.log(res.data)
            window.location.href="/daftar-tugas"
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const updateAnnouncement = (formData, lampiran_to_delete, current_lampiran, annData, annId, history) => dispatch => {
    // formData is the lampiran files
  axios
    .post(`/api/announcements/update/${annId}`, annData)
    .then(res => {
        console.log("Task updated to be :", res.data);
        console.log("Has lampiran? :", formData.has('lampiran_announcement'))
        if(lampiran_to_delete.length > 0)// axios.delete put the data is quite different.. 
            return axios.delete(`/api/uploads/lampiran_announcement/${annId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        else
            return "No lampiran file is going to be deleted"
        
    })
    .then(res => {
        console.log("Update the lampiran files, upload some new lampiran files")
        console.log(formData.has("lampiran_announcement"), formData.getAll("lampiran_announcement"))
        if(formData.has('lampiran_announcement'))
            return axios.post(`/api/uploads/upload_lampiran/${annId}`, formData);
        else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya.. 
            return "Successfully updated task with no lampiran"
    })
    .then(res => {
        console.log("Lampiran file is uploaded")
        alert("Announcement is created")
        // history.push("/daftar-pengumuman");
    })

    .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}
  