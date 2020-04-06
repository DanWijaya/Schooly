import { GET_TASKS } from "../actions/Types";

const initialState = {};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_TASKS: {
            console.log("Payload : ", action.payload);
            return action.payload;
        }
        default: 
            return state
    }

}