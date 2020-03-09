import axios from 'axios';

import { GET_ERRORS } from './Types';

// Add Class 
export const createClass = (classData) => dispatch => {
    axios
        .post("/api/classes/create", classData)
        .then(res => { 
            // history.pushState("/view")
            res.send(classData)
            alert("Class is created")
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
    };

    
// View Class
export const editClass = (classData) => dispatch => {
    axios
        .get("/api/classes/view", classData)
        .then(res => {
            console.log("Berhasil view Class");
            res.send(classData);
        })
        .catch(err => {
            console.log("error")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// View All Class 
export const viewClass = () => dispatch => {
    axios
        .get("/api/classes/viewall")
        .then(res => {
            console.log(res.data)
            console.log("Data should be here")
        })

        .catch(err => {
            // console.log("Data should be here")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

