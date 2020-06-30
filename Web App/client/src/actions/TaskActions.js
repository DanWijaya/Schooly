import axios from "axios";
import { GET_TASKS, GET_ERRORS, ADD_TASKS, GET_FILE_BY_USER, GRADE_TASKS} from "./Types";

// Addtask
export const createTask = (formData, taskData, history) => dispatch => {
  axios
    .post("/api/tasks/create", taskData)
    .then(res => {
        console.log("this is the res" , res.data._id)
        console.log("Will run this")
        console.log(formData.has('lampiran'))
        if(formData.has('lampiran'))
            return axios.post(`/api/uploads/upload_lampiran/${res.data._id}`, formData);
        else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya.. 
            return "Successfully created task with no lampiran"
    })
    .then(res => { console.log("Lampiran tugas is uploaded")
            alert("Task is created")
            history.push("/daftar-tugas")
        })
    .catch(err =>{
        console.log("error happened")
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    })   


    }

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

export const updateTask = (formData, lampiran_to_delete, current_lampiran, taskData, taskId, history) => dispatch => {
    // formData is the lampiran files
  axios
    .post(`/api/tasks/update/${taskId}`, taskData)
    .then(res => {
        console.log("Task updated to be :", res.data);
        console.log("Has lampiran? :", formData.has('lampiran'))
        if(lampiran_to_delete.length > 0)// axios.delete put the data is quite different.. 
            return axios.delete(`/api/uploads/lampiran/${taskId}`, {data: {lampiran_to_delete: lampiran_to_delete, current_lampiran: current_lampiran} })
        else
            return "No lampiran file is going to be deleted"
        
    })
    .then(res => {
        console.log("Update the lampiran files, upload some new lampiran files")
        console.log(formData.has("lampiran"), formData.getAll("lampiran"))
        if(formData.has('lampiran'))
            return axios.post(`/api/uploads/upload_lampiran/${taskId}`, formData);
        else // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya.. 
            return "Successfully updated task with no lampiran"
    })
    .then(res => {
        console.log("Lampiran file is uploaded")
        alert("Task is created")
        history.push("/daftar-tugas");
    })

    .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}


export const gradeTask = (taskId, gradingData, student_name) => dispatch => {
    console.log(taskId, gradingData)
    axios
        .post(`/api/tasks/update/${taskId}`, gradingData)
        .then(res => {
            console.log("Grade task is added")
            alert(`Tugas ${student_name} berhasil dinilai `);
            dispatch({
                type: GRADE_TASKS,
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
export const deleteTask = (taskId, history) => dispatch => {
  axios
    .delete("/api/tasks/delete/" + taskId)
    .then((res) => {
        console.log(res.data)
        window.location.href="/daftar-tugas"
    })
    .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}