// import { reject } from "async";
import axios from "axios";
import { GET_ERRORS, GET_ALL_ASSESSMENTS, GET_ASSESSMENT, GET_SUCCESS_RESPONSE } from "./Types";

// Add Assessment
export const createAssessment = (formData, assessment, history) => dispatch => {
  console.log(assessment)
  return (
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
        console.log(num_lampiran)
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
    .catch(err => {
        if(err.response){
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
          throw new Error("Assessment is not created successfully")
      }
    }
    )
  );
}

export const gradeAssessment = (assessment_id, gradingData, rslv) => dispatch => {
  axios
    .post(`/api/assessments/grade/${assessment_id}`, gradingData)
    .then(res => {
      console.log("Assessment updated to be :", res.data);
      rslv(res.data);
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: true
      })
      return res.data
    })
    .catch(err => {
      console.log(err);
      dispatch({
          type: GET_ERRORS,
          payload: err.response.data
      })
    })
}

export const updateAssessment = (formData, assessmentData, assessmentId, lampiran_to_delete, history) => dispatch => {
  // formData is the lampiran files
  return (
    axios
    .post(`/api/assessments/update/${assessmentId}`, assessmentData)
    // .then(res => {
    //     if(res){
    //       return updateAssessmentGrades;
    //     }
    //     else{
    //       return "Assessment answers are still the same";
    //     }
    // })
    .then(res => {
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
          return axios.post(`/api/upload/att_assessment/lampiran/${assessmentId}`, formData)
        }
        else {
          return "Successfully updated assessment with no lampiran"
        }
    })
    .then(res => {
      console.log(lampiran_to_delete)
        if(lampiran_to_delete.length){
          return axios.delete(`/api/upload/att_assessment/lampiran/${"some"}`, {data: {lampiran_to_delete: lampiran_to_delete}})
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
        throw new Error("Assessment is not updated successfully");
    })
  )
}

export const updateAssessmentGrades = (assessmentId, ans_list) => dispatch => {
  return (
    axios.post(`/api/assessments/updategrades/${assessmentId}`, ans_list)
        .then(res => { return res;})
        .catch(err => { throw new Error("Assessment grades are not updated successfully")})
  )
}

// View All Assessment
export const getAllAssessments = () => dispatch => {
  axios
    .get("/api/assessments/viewall")
    .then(res => {
      // console.log(res.data)
      console.log("getAllAssessments completed")
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
export const getOneAssessment = (id, rslv=null) => dispatch => {
  axios
    .get(`/api/assessments/view/${id}`)
    .then(res => {
      console.log("Assessment to be received: ", res.data);
      dispatch({
        type: GET_ASSESSMENT,
        payload: res.data
      })
      if(rslv){
        rslv(res)
      }
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

export const submitAssessment = (assessmentId, data) => dispatch => {
  // data contains the followiung objects:
  // let data = {
  //   "answers" : answer,
  //   "classId" : user.kelas,
  //   "userId" : user.id
  // }
  return (
    axios
      .post(`/api/assessments/submit/${assessmentId}`, data)
      .then((res) => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
        return new Error("Assessment fail to be submitted");
      })
  )
}

export const getKuisBySC = (subjectId, classId) => () => {
  return axios
      .get(`/api/assessments/getkuisbysc/${subjectId}&${classId}`)
      .then((res) => {
          console.log("getKuisBySC completed");
          return res.data;
      })
      .catch(() => {
          throw new Error("getKuisBySC error has occured");
      })
}

export const getUjianBySC = (subjectId, classId) => () => {
  return axios
      .get(`/api/assessments/getujianbysc/${subjectId}&${classId}`)
      .then((res) => {
          console.log("getUjianBySC completed");
          return res.data;
      })
      .catch(() => {
          throw new Error("getUjianBySC error has occured");
      })
}

export const updateAssessmentSuspects = (assessmentId, suspects) => {
  return axios
    .post(`/api/assessments/updateSuspects/${assessmentId}`, suspects)
    .catch(() => {
      throw new Error("updateAssessmentSuspects error has occured");
    });
}