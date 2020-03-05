import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

import { GET_CLASSES, ADD_CLASSES, GET_ERRORS } from './types';
import { json } from 'express';

// Add Class 
export const addClass = (classData, history) => dispatch => {
    axios
        .post("/api/classes/create", classData)
        .then(res => history.push("/view"))
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
            res.send(classData);
    })
}

// View All Class 
export const viewAllClass = (classData) => dispatch => {
    axios
        .post("/api/classes/viewall", classData)
        .then(res => 
                res.send(classData))
}

