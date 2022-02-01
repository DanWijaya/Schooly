import axios from "axios";
import {
  GET_ERRORS,
  GET_ALL_ASSESSMENTS,
  GET_ASSESSMENT,
} from "./Types";

// Add Assessment
export const createAssessment = (formData, assessment, history) => (
  dispatch
) => {
  return axios
    .post("/api/assessments/create", assessment)
    .then((res) => {
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

export const updateAssessment = (
  formData,
  assessmentData,
  assessmentId,
  lampiran_to_delete,
  history
) => (dispatch) => {
  // formData is the attachment files.
  return axios
    .put(`/api/assessments/update/${assessmentId}`, assessmentData)
    .then((res) => {
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (lampiran_to_delete.length > 0) {
        return axios.delete(`/api/files/assessments/${assessmentId}`, {
          data: { id_to_delete: lampiran_to_delete },
        });
      } else {
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
export const getAllAssessments = (unitId) => (dispatch) => {
  axios
    .get(`/api/assessments/viewall/${unitId}`)
    .then((res) => {
      console.log("getAllAssessments completed");
      console.log("Ini hasilnya : ", res);
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

// View One Task
export const getOneAssessment = (id) => (dispatch) => {
  return axios
    .get(`/api/assessments/view/${id}`)
    .then((res) => {
      console.log("Assessment to be received: ", res.data);
      dispatch({
        type: GET_ASSESSMENT,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.log("Error");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteAssessment = (id, type = "Kuis", history = null) => (
  dispatch
) => {
  return axios
    .delete(`/api/assessments/delete/${id}`)
    .then((res) => {
      let lampiran_to_delete = [];
      let { questions } = res.data;
      questions.forEach((question) => {
        let temp = [...lampiran_to_delete, ...question.lampiran];
        lampiran_to_delete = temp;
      });
      console.log("Lampiran to delete: ", lampiran_to_delete);
      if (lampiran_to_delete.length > 0) {
        return axios.delete(`/api/files/assessments/all/${id}`);
      }
      return "Assessment deleted has no lampiran";
    })
    .then((res) => {
      console.log(res);
      if (history) {
        if (type === "Kuis") {
          history.push({
            pathname: "/daftar-kuis",
            openDeleteSnackbar: true,
          });
        } else {
          history.push({
            pathname: "/daftar-ujian",
            openDeleteSnackbar: true,
          });
        }
      }
      return "Succesfully deleted Assessment";
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
  // data = {
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

export const getAssessmentsByClass = (classId) => (dispatch) => {
  return axios
    .get(`/api/assessments/viewByClass/${classId}`)
    .then((res) => {
      console.log("Get assessments by class completed");
      dispatch({
        type: GET_ASSESSMENT,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.error("Get Assessments by class failed");
      throw new Error(err);
    });
};
export const getAssessments = (type, subjectId, classId) => {
  return axios
    .get(`/api/assessments/view`, { params: { type, subjectId, classId } })
    .then((res) => {
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
      throw new Error(err.response.data);
    });
};

export const getStatus = (assessmentId) => {
  return axios
    .get(`/api/assessments/status/${assessmentId}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.response.data);
    });
};

export const validateAssessment = (assessmentData) => (dispatch) => {
  return axios
    .post(`/api/assessments/validity`, assessmentData)
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
  return axios
    .get(`/api/assessments/keyanswers/${assessmentId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err.response.data;
    });
};

// Question Analytics
// The implementation is done with sorting the question according correct answered questions.
export const getQuestionAnalytics = (assessmentId, top_K = 10) => {
  return axios.get(`/qnsDifficultyRanking/${assessmentId}`);
  /*
  @params : {
    1. assessmentID -> Id of the assessment.
    2. top_K -> To choose how many hardest question that want to be shown.
  }
  */
};
