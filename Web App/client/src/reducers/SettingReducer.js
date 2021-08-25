// Import dulu action" types nya
// buat initialStatenya, 

/*
    const initialState = { upload_limit: null }
*/

// Buat function reducersnya. Ikutin formatnya yang ada switch case itu.
// terus jangan lupa ditambahkan ke index.js  

import {
	GET_SETTING,
} from "../actions/Types";
  
const initialState = {
	upload_limit: null,
};

export default function (state = initialState, action) {
	switch(action.type) {
		case GET_SETTING:
			return{
				...state,
				upload_limit: action.payload.upload_limit,
			}
		default:
			return state;
	}
}