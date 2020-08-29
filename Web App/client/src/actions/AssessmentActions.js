import axios from "axios";
import { GET_ERRORS, GET_ALL_ASSESSMENTS, GET_ASSESSMENT, GET_SUCCESS_RESPONSE } from "./Types";

// Add Assessment
export const createAssessment = (assessment, history) => dispatch => {
  console.log(assessment)
  axios
    .post("/api/assessments/create", assessment)
    .then(res => {
      console.log(res.data)

      dispatch({
        type: GET_ERRORS,
        payload: false
      })
      let { questions } = assessment;
      console.log(questions)
      console.log(res._id)

      let promises = questions.map((qns, i) => {
        let formData = new FormData();

        qns.lampiran.forEach((lampiran, i) => formData.append("lampiran_assessment", lampiran))
        return (
          axios.post(`/api/upload/att_assessment/lampiran/${res.data._id}/${i}`, formData)
          .then(response => {
            console.log(response)
          })
        )
      })

      Promise.all(promises).then(() => {
        console.log('Successfully created Assessment.')
          dispatch({
            type: GET_SUCCESS_RESPONSE,
            payload: true
          });
        }
      ) 
    })
    .then(res => {
      console.log('Successfully created Assessment.')
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