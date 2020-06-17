import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router";

import {PWD_RESET_HASH_CREATED, PWD_RESET_HASH_FAILURE} from "./Types"

// SEND EMAIL TO API FOR HASHING
export const createHash = (email) => {
    return async (dispatch) => {
      //contact the API
    
      await fetch(
        //where to contact
        '/api/authentication/saveresethash',
        // what to send
        {
          method: 'POST',
          body: JSON.stringify({ email}),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin', //WTF IS THIS
        },
      )
      .then((res) => {
        if(res.status == 200) {
          return res.json();
        } else{
          return null;
        }
      })
      .then((json) => {
        if( json.username) 
          return dispatch({
            type: PWD_RESET_HASH_CREATED,
            payload: json
          })
        return dispatch({
          type: PWD_RESET_HASH_FAILURE,
          payload: new Error('Terjadi permasalahan teknis, coba lagi')
        })
      })
      .catch(err => dispatch({
        type: PWD_RESET_HASH_FAILURE,
        payload: err
      }));
      }
    }