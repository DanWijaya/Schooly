import axios from "axios";
import {
  GET_ERRORS,
  GET_ALL_MATERIALS,
  GET_MATERIAL,
  GET_SUCCESS_RESPONSE,
} from "./Types";

// Add Material
export const createMaterial = (formData, materialData, history) => (
  dispatch
) => {
  console.log("RUNLAH!!", formData, materialData);
  return axios
    .post("/api/materials/create", materialData)
    .then((res) => {
      console.log(formData.getAll("lampiran_materi"));
      // Give signal to Store to change/add the app's state.
      // From the code persepctive, it is done by dipatching actions.
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });

      if (formData.has("lampiran_materi")) {
        console.log("Post lampiran material is running");
        return axios.post(
          `/api/files/materials/upload/${res.data._id}`,
          formData
        );
      } else {
        // Must return something, if not it will continue to the next "then".
        console.log("Successfully created material.");
        return res;
      }
    })
    .then((res) => {
      console.log("Successfully created material.");
      let success_res = res.data._id;
      return success_res;
    })
    .catch((err) => {
      console.log("error happened");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const getAllMaterials = () => (dispatch) => {
  axios.get("/api/materials/viewall").then((res) => {
    console.log("material data is received");
    console.log(res.data);
    dispatch({
      type: GET_ALL_MATERIALS,
      payload: res.data,
    });
  });
};

export const getMaterial = (Id, category) => (dispatch) => {
  if (category === "by_author") {
    // The id will be author's id.
    axios
      .get(`/api/materials/viewByAuthor/${Id}`)
      .then((res) => {
        console.log("material datas are received");
        dispatch({
          type: GET_MATERIAL,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  } else if (category === "by_class") {
    // The id will be the class' id.
    axios
      .get(`/api/materials/viewByClass/${Id}`)
      .then((res) => {
        console.log("material by class is received");
        dispatch({
          type: GET_MATERIAL,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  } else {
    console.log("Please specify the search category");
  }
};

export const getOneMaterial = (materialId) => (dispatch) => {
  console.log("run getOneAnnoucnement");
  axios
    .get(`/api/materials/viewOne/${materialId}`)
    .then((res) => {
      console.log("material datas are received");
      dispatch({
        type: GET_MATERIAL,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};

export const deleteMaterial = (materialId, history = null) => (dispatch) => {
  return axios
    .delete(`/api/materials/delete/${materialId}`)
    .then((res) => {
      // let lampiran_to_delete = Array.from(res.data.lampiran)
      // return axios.delete(`/api/upload/att_material/lampiran/${"deleteall"}`, {data: {lampiran_to_delete: lampiran_to_delete} })
      return axios.delete(`/api/files/materials/all/${materialId}`);
    })
    .then((res) => {
      if (history) {
        history.push({
          pathname: "/daftar-materi",
          openDeleteSnackbar: true,
        });
      }
      console.log(res);
      return true;
      // window.location.href = "/daftar-materi";
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

export const updateMaterial = (
  formData,
  lampiran_to_delete,
  current_lampiran,
  materialData,
  materialId,
  history
) => (dispatch) => {
  // formData is the attachment files.
  return axios
    .put(`/api/materials/update/${materialId}`, materialData)
    .then((res) => {
      console.log("Material updated to be :", res.data);
      console.log("Has lampiran? :", formData.has("lampiran_materi"));
      dispatch({
        type: GET_ERRORS,
        payload: false,
      });
      if (lampiran_to_delete.length > 0) {
        // axios.delete put the data is quite different..
        return axios.delete(`/api/files/materials/${materialId}`, {
          data: { file_to_delete: lampiran_to_delete },
        });
      } else return "No lampiran file is going to be deleted";
    })
    .then((res) => {
      console.log("Update the lampiran files, upload some new lampiran files");
      console.log(
        formData.has("lampiran_materi"),
        formData.getAll("lampiran_materi")
      );
      if (formData.has("lampiran_materi")) {
        console.log("Lampiran material going to be uploaded");
        return axios.post(
          `/api/files/materials/upload/${materialId}`,
          formData
        );
      } // Must return something, if not it will continue to the next "then".
      else return res;
    })
    .then((res) => {
      console.log("Lampiran file is uploaded");
      return true;
    })

    .catch((err) => {
      console.log("ERROR happen when editing");
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      throw err.response.data;
    });
};

export const createMaterialComment = (materialId, comment) => {
  return axios
    .post(`/api/materials/comment/${materialId}`, comment)
    .catch(() => {
      throw new Error("createMaterialComment error has occured");
    });
};

export const editMaterialComment = (materialId, updatedContent, commentId) => {
  return axios
    .put(`/api/materials/comment/${materialId}`, { updatedContent, commentId })
    .catch(() => {
      throw new Error("editMaterialComment error has occured");
    });
};

export const deleteMaterialComment = (materialId, commentId) => {
  return axios
    .delete(`/api/materials/comment/${materialId}&${commentId}`)
    .catch(() => {
      throw new Error("deleteMaterialComment error has occured");
    });
};
