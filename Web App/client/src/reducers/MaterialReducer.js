import {GET_ALL_MATERIALS, GET_MATERIAL, SUCCESS_MATERIAL } from "../actions/Types";
import { FaCloudShowersHeavy } from "react-icons/fa";

const initialState = {
    selectedMaterials: [],
    all_materials: [],
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_ALL_MATERIALS: {
            return {
            ...state,
            all_materials: action.payload
            }
        }
        case GET_MATERIAL: {
            return {
            ...state,
            selectedMaterials: action.payload
            }
        }
        default: 
            return state
    }
}
