const avatar = require('./uploads');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User= require("../../models/user_model/User");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");


// @route POST api/users/register
// @desc Register user
// @access Public
// router.post("/register", (req, res) => {
//   // Form validation

router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  var reg_user
  if(req.body.role == "Student")
    reg_user = Student
  else
    reg_user = Teacher

  reg_user.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {

        var newUser
        if(req.body.role == "Student")
          newUser = new Student({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            emergency_phone: req.body.emergency_phone,
            address: req.body.address,
            kelas: req.body.kelas,
          });

        else if(req.body.role == "Teacher")
          newUser = new Teacher({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            emergency_phone: req.body.emergency_phone,
            address: req.body.address,
            subject_teached: req.body.subject_teached
          });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload

        var payload;
        if(user.role == "Student") {
          payload = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            phone: user.phone,
            emergency_phone: user.emergency_phone,
            address: user.address,
            avatar: user.avatar,
            // Student specific data
            kelas: user.kelas // Don't include password because don't want to make it visible by accessing token..
          };
        }
        else if(user.role == "Teacher") {
          payload = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            phone: user.phone,
            emergency_phone: user.emergency_phone,
            address: user.address,
            avatar: user.avatar,
            // Teacher specific data
            subject_teached: user.subject_teached // Don't include password because don't want to make it visible by accessing token..
          };
        }
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/update/:id", avatar.upload.single('avatar'), (req,res) => {
  console.log(req.file.filename)
  let id = req.params.id;

  User.findById(id , (err, user) => {
    if(!user)
      res.status(404).send("User data is not found");
    else{
      user.avatar = req.file.filename;

      user
          .save()
          .then()
          .catch(err => res.status(400).send("Unable to update user"))

      var payload;
      payload = {
        id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
          emergency_phone: user.emergency_phone,
          address: user.address,
          avatar: user.avatar,
      }

      if(user.role == "Student") {
        payload.kelas = user.kelas
        // payload = {
        //   id: user.id,
        //   role: user.role,
        //   name: user.name,
        //   email: user.email,
        //   phone: user.phone,
        //   emergency_phone: user.emergency_phone,
        //   address: user.address,
        //   avatar: user.avatar,
        //   // Student specific data
        //   kelas: user.kelas // Don't include password because don't want to make it visible by accessing token..
        // };
      }
      else if(user.role == "Teacher") {
        payload.subject_teached = user.subject_teached
        // payload = {
        //   id: user.id,
        //   role: user.role,
        //   name: user.name,
        //   email: user.email,
        //   phone: user.phone,
        //   emergency_phone: user.emergency_phone,
        //   address: user.address,
        //   avatar: user.avatar,
        //   // Teacher specific data
        //   subject_teached: user.subject_teached // Don't include password because don't want to make it visible by accessing token..
        // };
      }
      // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        }
      );
  }

})
})

router.get("/getteachers", (req, res) => {
  User.find({ role: 'Teacher' }).then((users, err) => {
    if(!users)
      console.log("No teachers yet in Schooly System")
    else
      return res.json(users)
  })
})

router.get("/getstudents", (req,res) => {
  User.find({ role: 'Student'}).then((users, err) => {
    if(!users)
      console.log("No students yet in Schooly System")

    else
      return res.json(users)
  })
})

module.exports = router;
