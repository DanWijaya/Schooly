import { GET_MATERIAL_FILES} from "../Types";
import axios from "axios";

// TESTING DENGAN S3

export const getAllS3 = () => dispatch => {
    axios.get("/api/files/material/")
    .then(res => {
        dispatch({
            // Hanya coba dengan GET_ALL_MATERIALS type. 
            type: GET_MATERIAL_FILES,
            payload: res.data
        })
    })
    .catch(err => {
        return new Error("Error in getting S3 files")
    })
}

export const uploadFileMaterials = (id, formData) => {
    return axios.post(`/api/files/material/upload/${id}`, formData)
}

export const getFileMaterials = (id) => dispatch => {
    axios.get(`/api/files/material/by_material/${id}`)
        .then((res) => {
            console.log("Materialnya: ", res.data)
            dispatch({
                type: GET_MATERIAL_FILES,
                payload: res.data
            })
        })
        .catch(err => new Error(err))
}

export const downloadFileMaterial = (id) => dispatch => {
    return axios.get(`/api/files/material/download/${id}`)
    .then((res) => {
        window.open(res.data)
        return res.data
        // let { file, filename} = res.data
        // let arraybuffer = Uint8Array.from(file.Body.data);
        // let blob=new Blob([arraybuffer], {type: file.ContentType});
        // let link=document.createElement('a');
        // link.href=window.URL.createObjectURL(blob);
        // link.download=filename;
        // link.click();
        // return link
    })
    .catch((err) => new Error("Error in getting S3 files"))
}

export const viewFileMaterial = (id) => dispatch => {
    console.log("view material is runned")
    axios.get(`/api/files/material/${id}`)
    .then((res) => {window.open(res.data) 
    return res.data})
    .catch((err) => new Error(err))
}

export const deleteFileMaterial = (id, file_to_delete, current_file) => {
    console.log(file_to_delete)
    return axios.delete(`/api/files/material/${id}`, {data: {file_to_delete: file_to_delete, current_file: current_file} })
}