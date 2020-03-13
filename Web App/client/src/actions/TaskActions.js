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
export const editTask = (taskData) => dispatch => {
    axios
        .get("/api/tasks/edit", taskData)
        .then(res => {
            console.log("Berhasil view Task");
            
        })
        .catch(err => {
            console.log("error")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}
