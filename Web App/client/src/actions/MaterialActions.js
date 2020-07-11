import axios from "axios";
import { GET_ERRORS, GET_ALL_MATERIALS, GET_MATERIAL, GET_SUCCESS_RESPONSE } from "./Types"

// Add material
export const createMaterial = (formData, materialData, history) => dispatch => {
    console.log("RUNLAH!!", formData, materialData)
    axios
      .post("/api/materials/create", materialData)
      .then(res => {
          console.log("this is the res" , res.data)
          console.log("Will run this")
          console.log(formData.getAll('lampiran_materi'))
          dispatch({
              type: GET_ERRORS,
              payload: false
          })
          if(formData.has('lampiran_materi')){
              console.log("Post lampiran material is running")
              return axios.post(`/api/uploads/upload_lampiran_materi/${res.data._id}`, formData);
          }
          else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
              return "Successfully created material with no lampiran"
      })
      .then(res => {
          console.log('Successfully created material.')
            dispatch({
                type: GET_SUCCESS_RESPONSE,
                payload: true
            })
            //   window.location.href="/daftar-materi"
            //   history.push("/daftar-materi")
          })
      .catch(err =>{
          console.log("error happened")
          dispatch({
              type: GET_ERRORS,
              payload: err.response.data
          })
      })
}

export const getAllMaterials = () => dispatch => {
    axios
        .get('/api/materials/viewall')
        .then((res) => {
            console.log("material data is received")
            console.log(res.data)
            dispatch({
                type: GET_ALL_MATERIALS,
                payload: res.data
            })
        })
}

export const getMaterial = (Id, category) => dispatch => {
    if(category == "by_author"){
        // the id will be author's id
        axios
            .get(`/api/materials/viewByAuthor/${Id}`)
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
        // the id will be the class id.
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
    else{
        console.log("Please specify the search category")
    }
}

export const getOneMaterial = (materialId) => dispatch => {
    console.log("run getOneAnnoucnement")
    axios
        .get(`/api/materials/viewOne/${materialId}`)
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
            console.log("Deleted: ", res.data)
            let lampiran_to_delete = Array.from(res.data.lampiran)
            return axios.delete(`/api/uploads/lampiran_materi/${"deleteall"}`, {data: {lampiran_to_delete: lampiran_to_delete} })
        })
        .then((res) => {
            console.log(res)
            window.location.href="/daftar-materi"
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const updateMaterial = (formData, lampiran_to_delete, current_lampiran, materialData, materialId, history) => dispatch => {
    // formData is the lampiran files
console.log("Update material is runned")
  axios
    .post(`/api/materials/update/${materialId}`, materialData)
    .then(res => {
        console.log("Task updated to be :", res.data);
        console.log("Has lampiran? :", formData.has('lampiran_materi'))
        dispatch({
            type: GET_ERRORS,
            payload: false
        })
        if(lampiran_to_delete.length > 0){// axios.delete put the data is quite different.. 
            return axios.delete(`/api/uploads/lampiran_materi/${materialId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        }
        else
            return "No lampiran file is going to be deleted"

    })
    .then(res => {
        console.log("Update the lampiran files, upload some new lampiran files")
        console.log(formData.has("lampiran_materi"), formData.getAll("lampiran_materi"))
        if(formData.has('lampiran_materi')){
            console.log("Lampiran material going to be uploaded")
            return axios.post(`/api/uploads/upload_lampiran_materi/${materialId}`, formData);
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
    })

    .catch(err => {
        console.log("ERROR happen when editing");
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}