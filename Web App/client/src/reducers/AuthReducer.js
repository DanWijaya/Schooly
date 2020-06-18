import { PWD_RESET_CLEAR, PWD_RESET_HASH_CREATED, PWD_RESET_HASH_FAILURE} from "../actions/Types"

const isEmpty = require("is-empty");
const initialState = {
    isPasswordReset: false,
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
        default:
            return state
    }
}