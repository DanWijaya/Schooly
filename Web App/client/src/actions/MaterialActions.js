import axios from "axios";
import { GET_ERRORS, GET_ALL_MATERIALS, GET_MATERIAL } from "./Types"

// Add material
export const createMaterial = (formData, materialData, history) => dispatch => {
    console.log("RUNLAH!!", formData, materialData)
    axios
      .post("/api/materials/create", materialData)
      .then(res => {
          console.log("this is the res" , res.data)
          console.log("Will run this")
          console.log(formData.getAll('lampiran_materi'))
          if(formData.has('lampiran_materi')){
              console.log("Post lampiran material is running")
              return axios.post(`/api/uploads/upload_lampiran_material/${res.data._id}`, formData);
          }
          else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
              return "Successfully created material with no lampiran"
      })
      .then(res => {
              alert("material is created")
              history.push("/daftar-materi")
          })
      .catch(err =>{
          console.log("error happened")
          dispatch({
              type: GET_ERRORS,
              payload: err.response.data
          })
      })
}

export const getAllmaterials = (materialId, history) => dispatch => {
    axios
        .get('/api/materials/viewall')
        .then((res) => {
            console.log("material data is received")
            dispatch({
                type: GET_ALL_MATERIALS,
                payload: res.data
            })
        })
}

export const getMaterial = (Id, category) => dispatch => {
    if(category == "by_author"){
        axios
            .get(`/api/materials/view/${Id}`)
            .then((res) => {
                console.log("material datas are received")
                dispatch({
                    type: GET_MATERIAL,
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
    } else if (category == "by_class"){
        axios
            .get(`/api/materials/viewByClass/${Id}`)
            .then((res) => {
                console.log("material by class is received")
                dispatch({
                    type: GET_MATERIAL,
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
}

export const getOneMaterial = (annId) => dispatch => {
    console.log("run getOneAnnoucnement")
    axios
        .get(`/api/materials/viewOne/${annId}`)
        .then((res) => {
            console.log("material datas are received")
            dispatch({
                type: GET_MATERIAL,
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

export const deleteMaterial = (materialId, history) => dispatch => {
    axios
        .delete(`/api/materials/delete/${materialId}`)
        .then((res) => {
            console.log(res.data)
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

export const updateMaterial = (formData, lampiran_to_delete, current_lampiran, annData, annId, history) => dispatch => {
    // formData is the lampiran files
  axios
    .post(`/api/materials/update/${annId}`, annData)
    .then(res => {
        console.log("Task updated to be :", res.data);
        console.log("Has lampiran? :", formData.has('lampiran_materi'))
        if(lampiran_to_delete.length > 0){// axios.delete put the data is quite different.. 
            return axios.delete(`/api/uploads/lampiran_materi/${annId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        }
        else
            return "No lampiran file is going to be deleted"

    })
    .then(res => {
        console.log("Update the lampiran files, upload some new lampiran files")
        console.log(formData.has("lampiran_materi"), formData.getAll("lampiran_materi"))
        if(formData.has('lampiran_materi')){
            console.log("Lampiran material going to be uploaded")
            return axios.post(`/api/uploads/upload_lampiran_material/${annId}`, formData);
        }
        else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya.. 
            return "Successfully updated task with no lampiran"
    })
    .then(res => {
        console.log("Lampiran file is uploaded")
        alert("material is created")
        history.push("/daftar-pengumuman");
    })

    .catch(err => {
        console.log("ERROR happen when editing");
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}
