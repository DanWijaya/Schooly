import {GET_ALL_MATERIALS, GET_MATERIAL } from "../actions/Types";

const initialState = {
    selectedMaterials: [],
    all_materials: []
}

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_ALL_MATERIALS: {
            return {
            ...state,
            all_announcements: action.payload
            }
        }
        case GET_MATERIAL: {
            return {
            ...state,
            selectedAnnouncements: action.payload
            }
        }
        default: 
            return state
    }
}
