import axios from "axios";
import {
  GET_ERRORS,
  GET_ALL_ASSESSMENTS,
  GET_ASSESSMENT,
  GET_SUCCESS_RESPONSE,
} from "./Types";

// Add Assessment
export const createAssessment = (formData, assessment, history) => (
  dispatch
) => {
  console.log(assessment);
  return axios
    .post("/api/assessments/create", assessment)
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      let { questions } = assessment;

      if (formData.has("lampiran_assessment")) {
        let num_lampiran = [];
        questions.forEach((qns) => {
          num_lampiran.push(qns.lampiran.length);
        });
        formData.append("num_lampiran", num_lampiran);
        console.log("num_lampiran:", num_lampiran);

        return axios.post(
          `/api/files/assessments/upload/${res.data._id}`,
          formData
        );
      } else {
        return res;
      }
    })
    .then((res) => {
      console.log("Successfully created Assessment.");
      let success_res = res.data._id;
      // dispatch({
      //   type: GET_SUCCESS_RESPONSE,
      //   payload: success_res,
      // });
      return success_res;
    })
    .catch((err) => {
      if (err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
        throw err.response.data;
        // throw new Error("Assessment is not created successfully");
      }
    });
};

/* export const gradeAssessment = (assessment_id, gradingData, rslv) => (
  dispatch
) => {
  axios
    .post(`/api/assessments/grade/${assessment_id}`, gradingData)
    .then((res) => {
      console.log("Assessment updated to be :", res.data);
      rslv(res.data);
      dispatch({
        type: GET_SUCCESS_RESPONSE,
        payload: true,
      });
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
}; */

export const updateAssessment = (
  formData,
  assessmentData,
  assessmentId,
  lampiran_to_delete,
  history
) => (dispatch) => {
  // formData is the lampiran files
  return axios
    .put(`/api/assessments/update/${assessmentId}`, assessmentData)
    .then((res) => {
      console.log(lampiran_to_delete);
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (lampiran_to_delete.length > 0) {
        return axios.delete(`/api/files/assessments/${assessmentId}`, {
          data: { file_to_delete: lampiran_to_delete },
        });
      } else {
        // harus return sesuatu, kalo ndak ndak bakal lanjut ke then yg selanjutnya..
        return "Successfully updated task with no lampiran";
      }
    })
    .then((res) => {
      console.log("Has lampiran? :", formData.has("lampiran_assessment"));
      let { questions } = assessmentData;
      if (formData.has("lampiran_assessment")) {
        let num_lampiran = [];
        questions.forEach((qns) => {
          let lampiran = qns.lampiran.filter((x) => typeof x !== "string");
          num_lampiran.push(lampiran.length);
        });
        console.log(formData.get("lampiran_assessment"));
        formData.append("num_lampiran", num_lampiran);
        console.log("Lampiran number ", num_lampiran);
        return axios.post(
          `/api/files/assessments/upload/${assessmentId}`,
          formData
        );
      } else {
        return "Successfully updated assessment with no lampiran";
      }
    })
    .then((res) => {
      console.log("Lampiran file is uploaded");
      // dispatch({
      //   type: GET_SUCCESS_RESPONSE,
      //   payload: true,
      // });
      return true;
    })

    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

// View All Assessment
export const getAllAssessments = () => (dispatch) => {
  axios
    .get("/api/assessments/viewall")
    .then((res) => {
      // console.log(res.data)
      console.log("getAllAssessments completed");
      dispatch({
        type: GET_ALL_ASSESSMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error has occured");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//View One Task
export const getOneAssessment = (id, rslv = null) => (dispatch) => {
  axios
    .get(`/api/assessments/view/${id}`)
    .then((res) => {
      console.log("Assessment to be received: ", res.data);
      dispatch({
        type: GET_ASSESSMENT,
        payload: res.data,
      });
      if (rslv) {
        rslv(res);
      }
    })
    .catch((err) => {
      console.log("Error");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteAssessment = (id, type = "Kuis", history=null) => (dispatch) => {
  return axios
    .delete(`/api/assessments/delete/${id}`)
    .then((res) => {
      console.log(res.data);
      let lampiran_to_delete = [];
      let { questions } = res.data;
      questions.forEach((question) => {
        let temp = [...lampiran_to_delete, ...question.lampiran];
        lampiran_to_delete = temp;
      });
      console.log("Lampiran to delete: ", lampiran_to_delete);
      if (lampiran_to_delete.length > 0) {
        return axios.delete(`/api/files/assessments/${id}`);
      }
      // return axios.delete(
      //   `/api/upload/att_assessment/lampiran/${"deleteall"}`,
      //   { data: { lampiran_to_delete: lampiran_to_delete } }
      // );
      return "Assessment deleted has no lampiran";
    })
    .then((res) => {
      console.log(res);
      if(history){
        if (type === "Kuis") {
          history.push({
            pathname: "/daftar-kuis",
            openDeleteSnackbar: true 
          })
          // window.location.href = "/daftar-kuis";
        } else {
          history.push({
            pathname: "/daftar-ujian",
            openDeleteSnackbar: true 
          })
          // window.location.href = "/daftar-ujian";
        }
    }
    return "Succesfully deleted Assessment"
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err;
    });
};

export const submitAssessment = (assessmentId, data) => (dispatch) => {
  // data contains the followiung objects:
  // let data = {
  //   "answers" : answer,
  //   "classId" : user.kelas,
  //   "userId" : user._id
  // }
  return axios
    .put(`/api/assessments/submit/${assessmentId}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
      return new Error("Assessment fail to be submitted");
    });
};

export const getAssessments = (type, subjectId, classId) => {
  return axios
    .get(`/api/assessments/view`, { params: { type, subjectId, classId } })
    .then((res) => {
      console.log("getAssessments completed");
      return res.data;
    })
    .catch(() => {
      throw new Error("getAssessments error has occured");
    });
};

export const updateAssessmentSuspects = (assessmentId, suspects) => {
  return axios
    .put(`/api/assessments/suspects/${assessmentId}`, suspects)
    .catch(() => {
      throw new Error("updateAssessmentSuspects error has occured");
    });
};

export const updateAssessmentGrades = (
  assessmentId,
  studentId,
  questionIdx,
  longtextGrade
) => {
  return axios
    .put(`/api/assessments/grades`, {
      assessmentId,
      studentId,
      questionIdx,
      longtextGrade,
    })
    .catch((err) => {
      // throw new Error("updateAssessmentGrades error has occured");
      throw new Error(err.response.data);
    });
};

export const getStatus = (assessmentId) => {
  return axios
  .get(`/api/assessments/status/${assessmentId}`)
  .then((res) => {return res})
  .catch((err) => {
    throw new Error(err.response.data);
  });
};

export const validateAssessment = (assessmentData) => (
  dispatch
) => {
  return axios.post(`/api/assessments/validity`, assessmentData)
  .then((res) => {
    dispatch({
      type: GET_ERRORS,
      payload: false,
    });
    return res;
  })
  .catch((err) => {
    if (err.response) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    }
  });
};

export const getKeyAnswers = (assessmentId) => {
  return axios.get(`/api/assessments/keyanswers/${assessmentId}`)
  .then((res) => {
    return res.data;
  })
  .catch((err) => {
    throw err.response.data;
  })
}

// export const getSubmissionsByStd = (assessmentId) => {
//   return axios.get(`/api/assessments/submissionsByStd/${assessmentId}`)

// }

// Implementasinya dengan cara urutkan soal berdasarkan jumlah benar oleh murid murid. 
export const getQuestionAnalytics = (assessmentId, top_K=10) => {
  return axios.get(`/qnsDifficultyRanking/${assessmentId}`);
  /* @params : {
    1. assessmentID -> Id of the assessment
    2. top_K -> untuk pilih mau munculin berapa soal tersulit
    */
  
}