import axios from "axios";
import { GET_ERRORS } from './Types';

// Addtask 
export const createTask = (taskData, history) => dispatch => {
    axios
        .post("/api/tasks/create", taskData)
        .then(res => {
            // history.push("/view")
            alert("Task is created")
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// View Task
export const viewTask = (taskData) => dispatch => {
    axios
        .post("/api/tasks/view", taskData)
        .then(res => {
            console.log("Berhasil view task");
            res.send(taskData);
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// View All Tasks
export const viewAllTasks = (taskData) => dispatch => {
    axios
        .post("/api/tasks/viewall", taskData)
        .then(res => res.send(taskData))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}
