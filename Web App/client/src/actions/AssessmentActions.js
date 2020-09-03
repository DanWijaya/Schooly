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
      let { questions } = assessment;

      console.log(res._id)
      if(formData.has("lampiran_assessment")){
        let num_lampiran = [];
        questions.forEach((qns) => {
          num_lampiran.push(qns.lampiran.length)
        })
        formData.append("num_lampiran", num_lampiran)

        return axios.post(`/api/upload/att_assessment/lampiran/${res.data._id}`, formData)
      }
      else{
        return "Successfully created Assessment with no lampiran"
      }
    })
    .then(res => {
      console.log('Successfully created Assessment.')
      dispatch({
          type: GET_SUCCESS_RESPONSE,
          payload: true
        });
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

export const updateAssessment = (formData, assessmentData, assessmentId, lampiran_to_delete, history) => dispatch => {
  // formData is the lampiran files
  axios
    .post(`/api/assessments/update/${assessmentId}`, assessmentData)
    .then(res => {
        console.log("Task updated to be :", res.data);
        console.log("Has lampiran? :", formData.has('lampiran_assessment'))
        dispatch({
            type: GET_ERRORS,
            payload: false
        })
        let { questions } = assessmentData;

        if(formData.has("lampiran_assessment")){
          let num_lampiran = [];
          questions.forEach((qns) => {
            let lampiran = qns.lampiran.filter(x => typeof x !== "string")
            num_lampiran.push(lampiran.length)
          })
          formData.append("num_lampiran", num_lampiran)
          console.log("Lampiran number ", num_lampiran)
          return axios.post(`/api/upload/att_assessment/lampiran/${res.data._id}`, formData)
        }
        else {
          return "Successfully updated assessment with no lampiran"
        }
        // if (lampiran_to_delete.length > 0)// axios.delete put the data is quite different..
        //     return axios.delete(`/api/upload/att_assessment/lampiran/${assessmentId}`, 
        //     { data: 
        //       { 
        //         lampiran_to_delete: lampiran_to_delete, 
        //         current_lampiran: current_lampiran 
        //       } 
        //     })
        // else
        //     return "No lampiran file is going to be deleted"

    })
    .then(res => {
      console.log(lampiran_to_delete)
        if(lampiran_to_delete.length){
          return axios.delete(`/api/upload/att_assessment/lampiran`, {data: {lampiran_to_delete: lampiran_to_delete}})
        }
        else {// harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
            return "Successfully updated task with no lampiran"
        }
    })
    .then(res => {
        console.log("Lampiran file is uploaded")
        dispatch({
            type: GET_SUCCESS_RESPONSE,
            payload: true
        })
    })

    .catch(err => {
        console.log(err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
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
      let lampiran_to_delete = [];
      let { questions } = res.data;
      questions.forEach((question) => {
        let temp = [...lampiran_to_delete, ...question.lampiran]
        lampiran_to_delete = temp;
      })
      console.log("Lampiran to delete: ", lampiran_to_delete)
      if (lampiran_to_delete.length > 0)
        return axios.delete(`/api/upload/att_assessment/lampiran/${"deleteall"}`, {data: {lampiran_to_delete: lampiran_to_delete}})
      return "Assessment deleted has no lampiran"
    })
    .then((res) => {
      console.log(res)
      // history.push("/daftar-kuis")
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