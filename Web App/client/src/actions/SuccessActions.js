import { CLEAR_SUCCESS_RESPONSE} from "./Types"

export const clearSuccess = () => dispatch => {
    dispatch({
        type: CLEAR_SUCCESS_RESPONSE,
        payload: null
    })
}