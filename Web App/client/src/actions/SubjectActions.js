import { GET_SUBJECT, GET_ALL_SUBJECTS} from "./Types";
import axios from "axios";

export const getSubject = (subjectId) => dispatch => {

    axios
        .get(`/api/subjects/view/${subjectId}`, subjectId)
        .then(res => {
            console.log("Run get one Subject")
            dispatch({
                type: GET_SUBJECT,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error in retrieving one subject")
            dispatch({
                type: GET_SUBJECT,
                payload: err.response.data
            })
        })
}

export const getAllSubjects = () => dispatch => {
    axios
        .get("/api/subjects/viewall")
        .then(res => {
            console.log("run get all subjects")
            dispatch({
                type: GET_ALL_SUBJECTS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err , "Error in retrievint all subjects")
        })
}
export const createSubject = (subjectData) => dispatch => {

    axios
        .post("/api/subjects/create", subjectData)
        .then(res => {
            console.log("run create subject")
            res.json("Successfully runned")
        })
        .catch(err => {
            console.log(err, "Error in creating the subject")
        })
}