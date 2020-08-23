import axios from "axios";
import { GET_ERRORS, GET_ALL_ASSESSMENTS, GET_ASSESSMENT, GET_SUCCESS_RESPONSE } from "./Types";

// Add Assessment
export const createAssessment = (formData, assessment, history) => dispatch => {
  console.log(assessment)
  axios
    .post("/api/assessments/create", assessment)
    .then(res => {
      console.log(res.data)

      dispatch({
        type: GET_ERRORS,
        payload: false
      })
      if(formData.entries().next().done){
        return axios.post(`/api/upload/att_assessment/image/${res.data._id}`, formData)
      }
      else
        return "Successfully created Assessment with no images"
      
    })
    .then(res => {
      console.log('Successfully created Assessment.')
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: true
      })
      
      history.push("/daftar-kuis")
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// View All Assessment
export const getAllAssessments = () => dispatch => {
  axios
    .get("/api/assessments/viewall")
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_ALL_ASSESSMENTS,
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

//View One Task
export const getOneAssessment = (id) => dispatch => {
  axios
    .get(`/api/assessments/view/${id}`)
    .then(res => {
      console.log("Assessment to be received: ", res.data);
      dispatch({
        type: GET_ASSESSMENT,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("Error")
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}

export const deleteAssessment = (id) => dispatch => {
  axios
    .delete(`/api/assessments/delete/${id}`)
    .then((res) => {
      console.log(res.data)
      window.location.href="/daftar-kuis"
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}