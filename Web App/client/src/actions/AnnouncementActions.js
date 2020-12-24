import axios from "axios";
import { GET_ERRORS, GET_ALL_ANNOUNCEMENTS, GET_ANNOUNCEMENT, GET_SUCCESS_RESPONSE } from "./Types"

// Add Announcement
export const createAnnouncement = (formData, announcementData, history) => dispatch => {
    console.log("RUNLAH!!", formData, announcementData)
    axios
      .post("/api/announcements/create", announcementData)
      .then(res => {
          console.log(formData.get('lampiran_announcement'))
          dispatch({
              type: GET_ERRORS,
              payload: false
          })
          if (formData.has('lampiran_announcement')) {
              console.log("Post lampiran announcement is running")
            //   return axios.post(`/api/upload/att_announcement/lampiran/${res.data._id}`, formData);
            return axios.post(`/api/files/announcement/${res.data._id}`, formData);
          }
          else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
              return "Successfully created announcement with no lampiran"
      })
      .then(res => {
          console.log("Announcement is Created!!!!")
          dispatch({
              type: GET_SUCCESS_RESPONSE,
              payload: true
            })
            //   history.push("/daftar-pengumuman")
          })
      .catch(err =>{
          console.log("error happened")
          dispatch({
              type: GET_ERRORS,
              payload: err.response.data
          })
      })
}

export const getAllAnnouncements = () => dispatch => {
    axios
        .get('/api/announcements/viewall')
        .then((res) => {
            console.log("Announcement data is received")
            dispatch({
                type: GET_ALL_ANNOUNCEMENTS,
                payload: res.data
            })
        })
}

export const getAnnouncement = (Id, category) => dispatch => {
    if (category === "by_author") {
        axios
            .get(`/api/announcements/view/${Id}`)
            .then((res) => {
                console.log("Announcement datas are received")
                dispatch({
                    type: GET_ANNOUNCEMENT,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            })
    }
    else if (category === "by_class") {
        axios
            .get(`/api/announcements/viewByClass/${Id}`)
            .then((res) => {
                console.log("Announcement by class is received")
                dispatch({
                    type: GET_ANNOUNCEMENT,
                    payload: res.data
                })
            })
    }
}

export const getOneAnnouncement = (annId) => dispatch => {
  console.log("run getOneAnnoucnement")
  axios
      .get(`/api/announcements/viewOne/${annId}`)
      .then((res) => {
        console.log("Announcement datas are received")
        dispatch({
            type: GET_ANNOUNCEMENT,
            payload: res.data
        })
      })
      .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
      })
}

export const deleteAnnouncement = (announcementId, lampiran_to_delete=null) => dispatch => {
    axios
        .delete(`/api/announcements/delete/${announcementId}`)
        .then((res) => {
            console.log("Deleted: ", res.data)
            let lampiran_to_delete = Array.from(res.data.lampiran)
            if (lampiran_to_delete.length > 0){
            //   return axios.delete(`/api/upload/att_announcement/lampiran/${"deleteall"}`, {data: {lampiran_to_delete: lampiran_to_delete}})
                return axios.delete(`/api/files/announcement/${announcementId}`, {data: {lampiran_to_delete: lampiran_to_delete }})
            }
            return "Announcement deleted has no lampiran"
        })
        .then((res) => {
            console.log(res)
            window.location.href="/daftar-pengumuman"
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
        dispatch({
            type: GET_ERRORS,
            payload: false
        })
        console.log("From actions: ", lampiran_to_delete)
        if (lampiran_to_delete.length > 0) {// axios.delete put the data is quite different..
            return axios.delete(`/api/files/announcement/${annId}`, {data: {lampiran_to_delete: lampiran_to_delete }})
        //   return axios.delete(`/api/upload/att_announcement/lampiran/${annId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        }
        else
          return "No lampiran file is going to be deleted"

    })
    .then(res => {
        console.log("Update the lampiran files, upload some new lampiran files")
        console.log(formData.has("lampiran_announcement"), formData.getAll("lampiran_announcement"))
        if (formData.has('lampiran_announcement')) {
            console.log("Lampiran announcement going to be uploaded")
            return axios.post(`/api/files/announcement/${annId}`, formData);
        }
        else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
            return "Successfully updated task with no lampiran"
    })
    .then(res => {
        console.log("Lampiran file is uploaded")
        dispatch({
            type: GET_SUCCESS_RESPONSE,
            payload: true
        })
        // alert("Announcement is created")
        // history.push("/daftar-pengumuman");
    })

    .catch(err => {
        console.log("ERROR happen when editing");
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}
