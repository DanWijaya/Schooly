import axios from "axios";
import {
    GET_ALL_UNITS,
    GET_UNIT
} from "./Types";

export const createUnit = (unitData) => { // try not to use dispatch
    return axios
            .post("/api/units/create", unitData)
            .then((res) => {
                return res.data._id;
            })
            .catch((err) => {
                throw err.response.data;
            })
}

export const getAllUnits = () => (dispatch) => {
    console.log("get All Units di panggil")
    return axios.get("/api/units/viewall")
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: GET_ALL_UNITS,
                    payload: res.data
                })
                return res.data;
            })
            .catch((err) => {
                throw err;
            })
}

export const getOneUnit = (id) => (dispatch) => {
    return axios.get(`/api/units/view/${id}`)
        .then((res) => {
            dispatch({
                type: GET_UNIT,
                payload: res.data
            })
            return res.data;
        })
        .catch((err) => {
            throw err;
        })
}

