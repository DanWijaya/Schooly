import axios from "axios";
import { GET_TASKS, GET_ERRORS, ADD_TASKS} from './Types';

// Addtask 
export const createTask = (taskData, history) => dispatch => {
    axios
        .post("/api/tasks/create", taskData)
        .then(res => {
            // history.push("/view")
            alert("Task is created")
            history.push("/viewtask");
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// View Task
export const viewTask = () => dispatch => {
    axios
        .get("/api/tasks/viewall")
        .then(res => {
            console.log(res.data);
            dispatch({
                type: GET_TASKS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error has occured");
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// View All Tasks
export const editTask = (taskId) => dispatch => {
    axios
        .get("/api/tasks/edit/" + taskId)
        // .get("/api/tasks/edit/" + taskId)
        .then(res => {
            console.log("Task to be edited: ", res.data);
            dispatch({
                type: GET_TASKS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("error")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const updateTask = (taskData, taskId, history) => dispatch => {
    axios
        // .post("/api/tasks/update/5e67b8a797cc01371983e17c")
        .post("/api/tasks/update/" + taskId, taskData)
        .then(res => {
            console.log("Task updated to be :", res.data);
            alert("Task is updated successfully");
            history.push("/viewtask");
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const deleteTask = (taskId, history) => dispatch => {
    axios
        .delete("/api/tasks/delete/" + taskId)
        .then((res) => {
            console.log(res.data)
            alert("Task Deleted")
            history.push("/viewtask")}
            )
        .catch(err => {
            console.log(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}
