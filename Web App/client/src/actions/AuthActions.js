import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router";

import {PWD_RESET_HASH_CREATED, PWD_RESET_HASH_FAILURE, GET_ERRORS} from "./Types"

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
         return null
        }
      })
      .then((json) => {
        console.log(json)
        if( json.success) // kalau emailnya ada di database 
          return dispatch({
            type: PWD_RESET_HASH_CREATED,
            payload: json
          })
        else{
          console.log("errornya di sini")
          return dispatch({
            type: GET_ERRORS,
            payload: json
          })
        }
      })
      .catch(err => { // Kalau emailnya ada masalah pas MailGun service send tke emailnya (cth misalnya emailnya gak ada di recipient list)
        console.log("Mailgun has error in sending email")
        console.log(err, "Errornya ini")
        dispatch({
        type: GET_ERRORS,
        payload: err
      })}
      );
      }
    }