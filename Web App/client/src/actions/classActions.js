import axios from 'axios';

import { GET_ERRORS } from './types';

// Add Class 
export const createClass = (classData) => dispatch => {
    axios
        .post("/api/classes/create", classData)
        .then(res => { 
            // history.pushState("/view")
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
export const viewClass = (classData) => dispatch => {
    axios
        .post("/api/classes/view", classData)
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
export const viewAllClass = (classData) => dispatch => {
    axios
        .post("/api/classes/viewall", classData)
        .then(res => res.send(classData))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

