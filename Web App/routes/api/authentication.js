const avatar = require("./uploads");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const crypto = require('crypto');
const mailgun = require("mailgun-js")({
  apiKey: keys.mailGunService.apiKey,
  domain: keys.mailGunService.domain,
})
const passport = require("passport");

// this is not secure at all to put the apiKey. 

// Load input validation

// Load User model
const User= require("../../models/user_model/User");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");
const Class = require("../../models/Class")

// POST to saveresethash
router.post('/saveresethash', async(req,res) => {
    let result;
    let error_message;
    console.log("Save rest hash is runned")
    try {
        //check and make sure the email exists
        const query = User.findOne({ email: req.body.email});
        const foundUser = await query.exec();

        //If the user exists, save their password hash
        const timeInMs = Date.now();
        const hashString = `${req.body.email}${timeInMs}`;
        const secret = keys.crypto.secret;
        // the secret key should not be stored here in the code.. 

        const hash = crypto.createHmac('sha256', secret)
                            .update(hashString)
                            .digest('hex')
                            
        foundUser.passwordReset = hash;
        console.log(hash)
        foundUser.save((err) => {

            // Put together the email
            const emailData = {
              from: `Schoolysystem-no-reply <postmaster@sandboxa9362837cf4f4b1ca75f325216ac2b8e.mailgun.org>`,
              to: foundUser.email,
              subject: 'Mengubah Kata Sandi',
              text: `Permohonan untuk mengubah kata sandi akun Schooly dengan email ${foundUser.email} dilakukan. Jika ini benar anda, silahkan klik tautan ini https://localhost:3000/akun/ubah-katasandi/${foundUser.passwordReset} (belum working ya)... Jika ini bukan anda, Silahkan abaikan email ini!`
              // html: `<p>A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: <a href="https://musiclist.com/account/change-password/${foundUser.passwordReset}&quot; target="_blank">https://musiclist.com/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
            };

            // Send it
            mailgun.messages().send(emailData, (error, body) => {
              if (error || !body) {
                // pas kaloa da masalah dgn Mailgunnya ndak bisa send email
                result = res.send(JSON.stringify({ problem: 'Terjadi masalah, silahkan coba lagi' }));
              } else {
                result = res.send(JSON.stringify({ success: true }));
              }
            });
          });
      } catch (err) {
          // ini kalo usernya tidak exist.
          result = res.send(JSON.stringify({ problem: 'Email ini tidak ada di database kami' }));
        }
        return result;
});

// POST to savepassword
router.post('/savepassword', async (req, res) => {
  let result;
  try {
    // look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();
    console.log(foundUser.email)
    // If the user exists save their new password
    if (foundUser) {
      // user passport's built-in password set method

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          foundUser.password = hash;
          foundUser
            .save()
            .then(() => result = res.send(JSON.stringify({ success: true })))
            .catch(err => result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' })))
        });
      });
    }
  } catch (err) {
    // if the hash didn't bring up a user, error out
    result = res.send(JSON.stringify({ error: 'Reset hash not found in database' }));
  }
  return result;
});

module.exports = router