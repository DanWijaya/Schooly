import axios from "axios";
import { GET_ERRORS } from "./Types";

// Add Assessment
export const createAssessment = (assessment, history) => dispatch => {
  console.log(assessment)
  axios
    .post("/api/assessments/create", assessment)
    .then(res => {
      console.log(res.data)
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
// export const getAllAssessments = () => dispatch => {
//   axios
//     .get("/api/assessments/viewall")
//     .then(res => {

//     })
// }
