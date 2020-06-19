import axios from "axios";
import { GET_TASKS, GET_ERRORS, ADD_TASKS, GET_FILE_BY_USER} from "./Types";

// Addtask
export const createTask = (taskData, history) => dispatch => {
  axios
    .post("/api/tasks/create", taskData)
    .then(res => {
        history.push("/view")
        // window.location.href = "./view"
        alert("Task is created")
        history.push("/newtasklist");
    })
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

// export const getTaskByUser = (userId) => dispatch => {
//     axios
//       .get("/api/users/gettask/" + userId)
//       .then(res => {
//           console.log(res.data);
//           dispatch({ 
//             type: GET_FILE_BY_USER,
//             payload: res.data
//           })
//       })
//       .catch(err => {
//         console.log("Error in retrieving the user tasks");
//         dispatch({
//           type: GET_ERRORS,
//           payload: err.response.data
//         })
//       })
//   }

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
export const viewOneTask = (taskId) => dispatch => {
  axios
    .get("/api/tasks/viewOneTask/" + taskId)
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
        history.push("/newtasklist");
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
        window.location.reload()
        // history.push("/viewtask")
    })
    .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}
