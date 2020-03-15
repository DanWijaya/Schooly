import { GET_CLASSES} from "../actions/Types";
import isEmpty from "is-empty";

const initialState = {};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_CLASSES:{
            console.log("Payload : ", action.payload);
            return action.payload;
        }

        default: 
            return state
    }
}