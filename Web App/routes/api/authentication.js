const Validator = require("validator");
const isEmpty = require("is-empty");

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

// This is not secure at all to put the apiKey.
// Load input validation
// Load User model

const User= require("../../models/user_model/User");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");
const Class = require("../../models/Class");
const { isMaster } = require("cluster");

// POST to saveresethash
router.post('/saveresethash', async(req,res) => {
    let result;
    let error_message;
    console.log("Save rest hash is runned")
    try {
        // Check and make sure the email exists
        const query = User.findOne({ email: req.body.email});
        const foundUser = await query.exec();

        // If the user exists, save their password hash
        const timeInMs = Date.now();
        const hashString = `${req.body.email}${timeInMs}`;
        const secret = keys.crypto.secret;
        // The secret key should not be stored here in the code..

        const hash = crypto.createHmac('sha256', secret)
                            .update(hashString)
                            .digest('hex')
        let current_time = new Date()
        foundUser.passwordReset = hash;
        foundUser.passwordResetTime = current_time;
        let time_in_string = current_time.toLocaleString("id-ID", {timeZone: "Asia/Bangkok"})
        foundUser.save((err) => {
            // Put together the email
            const emailData = {
              from: `Schoolysystem-no-reply <postmaster@sandboxa9362837cf4f4b1ca75f325216ac2b8e.mailgun.org>`,
              to: foundUser.email,
              subject: `Permohonan Mengubah Kata Sandi di saat ${time_in_string}`,
              html: `Permohonan untuk mengubah kata sandi akun Schooly dengan alamat email ${foundUser.email} dilakukan. Silahkan klik tautan dibawah ini. <b>Tautan ini hanya berlaku selama 5 menit dan hanya bisa digunakan untuk mengubah kata sandi satu kali.</b> <br/><br/> <a href="http://localhost:3000/akun/ubah-katasandi/${foundUser.passwordReset}">Ubah Kata Sandi</a>`,
              // html: `<a href="http://localhost:3000/akun/ubah-katasandi/${foundUser.passwordReset}">Ubah Kata Sandi</a>`
            };

            // Send it
            mailgun.messages().send(emailData, (error, body) => {
              if (error || !body) {
                // pas kaloa da masalah dgn Mailgunnya ndak bisa send email
                result = res.send(JSON.stringify({ problem: 'Terjadi masalah, silahkan coba lagi' }));
              }
              else {
                result = res.send(JSON.stringify({ success: true }));
              }
            });
          });
      } catch (err) {
          // This is for if the user doesn't exist
          result = res.send(JSON.stringify({ problem: 'Email ini tidak ada di database kami' }));
        }
        return result;
});

// POST to savepassword
router.post('/savepassword', async (req, res) => {
  let result;
  try {
    // Look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();
    console.log(foundUser.email)
    console.log("This is the found User: " , foundUser)
    let current_time = new Date();
    let diff = (current_time.getTime() - foundUser.passwordResetTime.getTime()) / 1000; // in seconds
    let minute_difference = diff /= 60;

    // If the user exists save their new password
    console.log(req.body.password, "PAssword")
    console.log(req.body)
    if (Validator.isEmpty(req.body.password)) {

      result = res.send(JSON.stringify({ password_entry: 'Kata sandi baru belum diisi' }))
    }
    else if (!Validator.isLength(req.body.password, { min: 8, max: 30 })) {
      result = res.send(JSON.stringify({ password_entry: 'Kata sandi harus terdiri dari 8 hingga 30 karakter' }))
    }
    else if (!Validator.equals(req.body.password, req.body.password2)) {
      result = res.send(JSON.stringify({ password_match: 'Konfirmasi kata sandi harus sama' }))
    }
    else if (minute_difference > 5) {
      console.log("Link has expired (exceed 5 mins)")
      result = res.send(JSON.stringify({ reset_problem: 'Tautan ini sudah tidak berlaku setelah 5 menit' , expired: "yes"}))
    }
    else {
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          foundUser.password = hash;
          foundUser.passwordReset = "Already used"
          foundUser
            .save()
            .then(() => result = res.send(JSON.stringify({ success: true })))
            .catch(err => result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' })))
        });
      });
    }
  } catch (err) {
    console.log("There is an error")
    // If the hash didn't bring up a user, error out
    result = res.send(JSON.stringify({ reset_problem: 'Tautan sudah dipakai sebelumnya, silahkan memohon untuk mengubah kata sandi lagi', expired: "yes" }));
  }
  return result;
});

router.post("/changepassword", (req,res) => {
  const email = req.body.email;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  const new_password2 = req.body.new_password2;
  console.log(email)
  if (Validator.isEmpty(req.body.new_password)) {
    if (Validator.isEmpty(req.body.old_password))
      return res.status(404).json({ new_password: 'Kata sandi baru belum diisi',
       old_password: 'Kata sandi saat ini belum diisi' })

    return res.status(404).json({ new_password: 'Kata sandi baru belum diisi'})
  }
  else if (!Validator.isLength(req.body.new_password, { min: 8, max: 30 })) {
    return res.status(404).json({ new_password: 'Kata sandi harus terdiri dari 8 hingga 30 karakter' })
  }
  else if (!Validator.equals(new_password, new_password2)) {
    return res.status(404).json({ new_password: 'Konfirmasi Kata sandi harus sama'})
  }

  User.findOne({ email }).then(user => {

    if (!user) {
      return res.status(404).json({ emailnotfound: "Pengguna dengan email ini tidak ditemukan"});
    }

    // Check password
    bcrypt.compare(old_password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched, then hash the new password before saving to Database.
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
      else {
        return res.status(404).json({ old_password: "Tidak sama dengan kata sandi sekarang"})
      }
    })
  })
});

module.exports = router
