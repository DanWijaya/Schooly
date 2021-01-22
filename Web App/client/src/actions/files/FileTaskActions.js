import axios from "axios";
import { GET_ERRORS, GET_SUCCESS_RESPONSE } from "../Types";

export const uploadFileTasks = (formData, task_id, author_id) => dispatch => {
    axios
        .post(`/api/files/tasks/upload/${task_id}`, formData)
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_SUCCESS_RESPONSE,
                payload: res.data
            })
        })
}

export const getFileTasks = (task_id) => dispatch => {
    return axios.get(`/api/files/tasks/by_task/${task_id}`)
        .then((res) => {
            console.log("Tasknya: ", res.data)
            return res.data
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
            return new Error(err)}
        )
}

export const downloadFileTasks = (id) => dispatch => {
    return axios.get(`/api/files/tasks/download/${id}`)
        .then((res) => {
            window.open(res.data)
            return res.data
        })
        .catch((err) => {
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
            new Error("Error in getting S3 files")
        })
}

export const viewFileTasks = (id) => dispatch => {
    axios.get(`/api/files/tasks/${id}`)
        .then((res) => {
            window.open(res.data) 
            return res.data
        })
        .catch((err) => new Error(err))
}

export const deleteFileTasks = (id, delete_all=false) => dispatch => {
    axios.delete(`/api/files/tasks/${id}`, {data: {delete_all: delete_all} })
    .then(res => {
        console.log(res.data)
        dispatch({
            type: GET_SUCCESS_RESPONSE,
            payload: res.data
        })
        window.location.reload();
    })
}