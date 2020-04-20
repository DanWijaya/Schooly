import { TEST_UPLOAD } from "./Types";
import axios from 'axios';

export const uploadImage = (image, history) => dispatch => {
    console.log("Hi")
    axios
        .post("/api/uploads/upload", image)
        .then(res => {
            // console.log(image)
            console.log("Profile picture is:" , res.data);
            dispatch({
                type: TEST_UPLOAD,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
}