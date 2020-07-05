import { GET_ERRORS, UPDATE_ERRORS } from "./Types"

export const clearErrors = (field=null) => dispatch => {
    dispatch({
        type: GET_ERRORS,
        payload: {}
    })
}