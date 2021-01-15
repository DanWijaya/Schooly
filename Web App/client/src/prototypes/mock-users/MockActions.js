import axios from "axios";

// Submit Button
export const importUsers = (userData) => (dispatch) => {
  axios
    .post("/api/mockusers/importUsers", userData)
    .then((res) => {
      window.location.reload();
      console.log("Data CSV telah tersimpan");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Action Export/Download Button
export const exportUsers = (userData) => (dispatch) => {
  axios
    .get("/api/mockusers/exportUsers", userData)
    .then((res) => {})
    .catch((err) => {
      dispatch({
        type: "ERROR_EXPORT",
        payload: err.response.data,
      });
    });
};

export const getMockTeachers = (data = "array") => (dispatch) => {
  axios
    .get("/api/mockusers/getMockTeachers")
    .then((res) => {
      if (data === "map") {
        let temp = new Map();
        res.data.forEach((teacher) => {
          temp.set(teacher._id, teacher);
        });
        dispatch({
          type: "GET_ALL_MOCK_TEACHERS",
          payload: temp,
        });
      } else {
        dispatch({
          type: "GET_ALL_MOCK_TEACHERS",
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      console.log("Error in getting all mock teachers:");
    });
};

export const getMockStudents = () => (dispatch) => {
  console.log("get mock students is runned");
  axios
    .get("/api/mockusers/getMockStudents")
    .then((res) => {
      console.log("Mock students :", res.data);
      dispatch({
        type: "GET_ALL_MOCK_STUDENTS",
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Error in getting all mock students");
    });
};

export const setMockUserDisabled = (userId) => (dispatch) => {
  axios
    .post(`/api/mockusers/setUserDisabled/${userId}`)
    .then((res) => {
      console.log(res.data);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteMockUser = (userId) => (dispatch) => {
  axios
    .delete(`/api/mockusers/delete/${userId}`)
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log("Error in deleting mock students");
    });
};
