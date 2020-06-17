const avatar = require("./uploads");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const crypto = require('crypto');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// const validateUserDataInput = require("../../validation/UserData")

// Load User model
const User= require("../../models/user_model/User");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");
const Class = require("../../models/Class")

// POST to saveresethash
router.post('/saveresethash', async(req,res) => {
    let result;
    console.log("Save rest hash is runned")
    try {
        //check and make sure the email exists
        const query = User.findOne({ email: req.body.email});
        const foundUser = await query.exec();

        //If the user exists, save their password hash
        const timeInMs = Date.now();
        const hashString = `${req.body.email}${timeInMs}`;
        const secret = 'alongrandomstringshouldgohere';
        // the secret key should not be stored here in the code.. 

        const hash = crypto.createHmac('sha256', secret)
                            .update(hashString)
                            .digest('hex')
        foundUser.passwordReset = hash;
        console.log(hash)
        foundUser.save((err) => {
            if (err) { result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' })); }
            result = res.send(JSON.stringify({ success: true }));
          });
    } catch (err) {
        // if the user doesn't exist, error out
        console.log("User does not exist")
        result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
      }
      return result;
});

module.exports = router