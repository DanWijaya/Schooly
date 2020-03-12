import axios from "axios";
import { GET_TASKS, GET_ERRORS, ADD_TASKS} from './Types';

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
export const viewTask = () => dispatch => {
    axios
        .post("/api/tasks/view")
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
