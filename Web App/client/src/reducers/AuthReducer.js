import { PWD_RESET_CLEAR, PWD_RESET_HASH_CREATED, PWD_RESET_HASH_FAILURE, PWD_SAVE_FAILURE, PWD_SAVE_SUCCESS } from "../actions/Types"

const initialState = {
    isPasswordReset: false,
    isPasswordUpdated: false,
    email: ""
};

export default function(state=initialState, action) {
    switch (action.type) {
        case PWD_RESET_CLEAR:
        case PWD_RESET_HASH_FAILURE:{
            return {
                ...state,
                isPasswordReset: false,
            }
        }
        case PWD_RESET_HASH_CREATED:{
            return{
                ...state,
                isPasswordReset: true
            }
        }
        case PWD_SAVE_FAILURE: {
            return{
                ...state,
                isPasswordUpdated: false
            }
        }
        case PWD_SAVE_SUCCESS: {
            return{
                ...state,
                isPasswordUpdated: true
            }
        }
        default:
            return state
    }
}
