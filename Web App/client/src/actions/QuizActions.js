import axios from "axios";
import { GET_ERRORS, GET_ALL_CLASSES, GET_ALL_CLASSES_MAP, GET_CLASSES, SET_CURRENT_CLASS } from "./Types";

// Add Quiz
export const createQuiz = (quiz, history) => dispatch => {
  axios
    .post("/api/quizzes/create", quiz)
    .then(res => {
      console.log(res.data)
      history.push("/daftar-quiz")
    })
    .catch(err => 
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
    );
}

// View All Quizzes
