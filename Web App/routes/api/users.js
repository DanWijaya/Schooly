const avatar = require("./upload/uploads");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/Register");
const validateLoginInput = require("../../validation/Login");
// const validateUserDataInput = require("../../validation/UserData")

// Load User model
const User= require("../../models/user_model/User");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");
const Admin = require("../../models/user_model/Admin");
const Class = require("../../models/Class")
const { ObjectId } = require("mongodb");
const Validator = require("validator");
const isEmpty = require("is-empty");

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
  // res stands for response
  // req.body.name
  // req.body.subject_teached

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email sudah terdaftar" });
    }
    else {
        var newUser
        if (req.body.role === "Student")
          newUser = new Student(req.body)
        else if (req.body.role === "Teacher")
          newUser = new Teacher(req.body)
        else {
          newUser = new Admin(req.body)
        }

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
      return res.status(404).json({ emailnotfound: "Email tidak ditemukan" });
    }
    if (!user.active) {
      return res.status(404).json({ notactive: "Akun ini belum aktif"})
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload

        var payload = {
          id: user.id,
          role: user.role,
          avatar: user.avatar,

          //Informasi Pribadi
          name: user.name,
          tanggal_lahir: user.tanggal_lahir,
          jenis_kelamin: user.jenis_kelamin,
          sekolah: user.sekolah,

          //Kontak
          email: user.email,
          phone: user.phone,
          emergency_phone: user.emergency_phone,
          address: user.address,

          //Kontak
          hobi_minat: user.hobi_minat,
          ket_non_teknis: user.ket_non_teknis,
          cita_cita: user.cita_cita,
          uni_impian: user.uni_impian

        };
        if (user.role === "Student") {
          payload.kelas = user.kelas
          payload.tugas = user.tugas
        }

        else if (user.role === "Teacher") {
          payload.subject_teached = user.subject_teached
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
      else {
        return res
          .status(400)
          .json({ passwordincorrect: "Kata sandi tidak benar" });
      }
    });
  });
});

router.post("/update/data/:id", (req,res) => {
  let email = req.body.email;
  if (isEmpty(email)) {
    return res.status(404).json({ email : "Email belum diisi"})
  }
  if (!Validator.isEmail(email)) {
    console.log("Email is not valid")
    return res.status(404).json({ email : "Email tidak benar"})
  }

  let id = req.params.id
  User.findById(id, (err, user) => {
        if (!user) {
          return res.status(404).json({ usernotfound: "Pengguna tidak ditemukan"});
        }
        else {
          console.log("Before update")
          console.log(user)

          // Informasi Pribadi
          // user.tugas = req.body.tugas
          user.name = req.body.nama;
          user.tanggal_lahir = req.body.tanggal_lahir;
          user.jenis_kelamin = req.body.jenis_kelamin;
          user.sekolah = req.body.sekolah;

          //Kontak
          user.email = req.body.email;
          user.phone = req.body.no_telp;
          user.emergency_phone = req.body.no_telp_darurat;
          user.address = req.body.alamat;

          //Karir
          user.hobi_minat = req.body.hobi_minat;
          user.ket_non_teknis = req.body.ket_non_teknis;
          user.cita_cita = req.body.cita_cita;
          user.uni_impian = req.body.uni_impian;

          console.log("After update")
          console.log(user)
          user
              .save()
              .then(console.log("Done with updating user data"))
              .catch(err => console.log(err))

          var payload = {
            id: user.id,
            role: user.role,
            avatar: user.avatar,

            // Informasi Pribadi
            name : user.name,
            tanggal_lahir : user.tanggal_lahir,
            jenis_kelamin : user.jenis_kelamin,
            sekolah : user.sekolah,

            //Kontak
            email : user.email,
            phone : user.phone,
            emergency_phone : user.emergency_phone,
            address : user.address,

            //Karir
            hobi_minat : user.hobi_minat,
            ket_non_teknis : user.ket_non_teknis,
            cita_cita : user.cita_cita,
            uni_impian : user.uni_impian
          }

          if (user.role === "Student") {
            payload.kelas = user.kelas
            payload.tugas = user.tugas
          }

          else if (user.role === "Teacher") {
            payload.subject_teached = user.subject_teached
          }

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
      });
});

router.get("/gettask/:id/:task_id", (req, res) => {
  let id = req.params.id;
  let tugasId = req.params.task_id;

  // res.send([])
  User.findById(id, (err, user) => {
    if (!user || !user.active)
      res.status(404).send("User data is not found");
    else {
      let tugasList = []
      if (user.role === "Student") { //Student are the ones has tugas field...
        user.tugas.map((item) => {
        console.log(item.for_task_object, tugasId)
        if (String(item.for_task_object) === String(tugasId)){
          tugasList.push(item)
            }
          }
        )}
      res.json(tugasList)
    }
  })
})

router.get("/getalltask/:user_id", (req,res) => {
  let id = req.params.user_id;

  User.findById(id, (err, user) => {
    if (!user || !user.active)
      res.status(404).send("User data is not found");
    else {
      let allFilesList = []
      if (Boolean(user.tugas) && Boolean(user.tugas.length))
        user.tugas.map((item) => allFilesList.push(item))
      res.json(allFilesList)
    }
  })
})

router.post("/update/avatar/:id", avatar.uploadAvatar.single("avatar"), (req,res) => {
  let id = req.params.id;

  User.findById(id , (err, user) => {
    if (!user || !user.active)
      res.status(404).send("User data is not found");
    else {
      user.avatar = req.file.filename;
      console.log("Avatarnya: ", req.file.filename)
      console.log("User avatarnya: ", user.avatar)
      user
          .save()
          .then()
          .catch(err => console.log(err))

      var payload = {
        id: user.id,
            role: user.role,
            avatar: user.avatar,

            // Informasi Pribadi
            name : user.name,
            tanggal_lahir : user.tanggal_lahir,
            jenis_kelamin : user.jenis_kelamin,
            sekolah : user.sekolah,

            //Kontak
            email : user.email,
            phone : user.phone,
            emergency_phone : user.emergency_phone,
            address : user.address,

            //Karir
            hobi_minat : user.hobi_minat,
            ket_non_teknis : user.ket_non_teknis,
            cita_cita : user.cita_cita,
            uni_impian : user.uni_impian
      }

      if (user.role === "Student") {
        payload.kelas = user.kelas
      }

      else if (user.role === "Teacher") {
        payload.subject_teached = user.subject_teached
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
  // console.log("GET teachers runned")
  User.find({ role: "Teacher", active: true }).then((users, err) => {
    if (!users)
      console.log("No teachers yet in Schooly System")
    else
      return res.json(users)
  })
})

router.get("/getstudents", (req,res) => {
  User.find({ role: "Student", active: true}).then((users, err) => {
    if (!users)
      console.log("No students yet in Schooly System")

    else
      return res.json(users)
  })
})

router.get("/getOneUser/:id", (req,res) => {
  console.log("getOneUser is runned")
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (!user || !user.active)
      return res.status(404).json("No user is found in Database")
    else
      return res.json(user)
  })
})

router.get("/getUsers", (req,res) => {
  const{ userIds } = req.query;
  console.log("User ids : ", userIds)
  let ids_to_find

  if (userIds !== undefined) {
    ids_to_find = userIds.map((id) => new ObjectId(id))
  }

  User.find({_id : { $in : userIds}, active: true}, (err, users) => {
    console.log("usernya ini : ", users)
    if (!users)
      return res.status(400).json("Users to update not found")
    else
      return res.json(users)
  })
})

router.get("/getstudentsbyclass/:id", (req,res) => {
  let id = req.params.id
  Student.find({ kelas: id, active: true}).then((users, err) => {
    if (!users)
      console.log("No students with this class ID")
    else{
      // console.log("Users by class : ", users)
      return res.json(users)
    }
  })
})

router.get("/all_users", (req,res) => {
  User.find({ active: true }).then((users, err) => {
    if (!users)
      return res.status(404).json("No students yet in Schooly system")
    else
      return res.json(users)
  })
})

// for admin only
router.get("/getpendingstudents", (req,res) => {
  User.find({ role: "Student", active: false }).then((users, err) => {
    if (!users)
      return res.json([])
    else
      return res.json(users)
  })
})

router.get("/getpendingteachers", (req,res) => {
  User.find({ role: "Teacher", active: false }).then((users, err) => {
    if (!users)
      return res.json([])
    else
      return res.json(users)
  })
})

router.post("/setuseractive/:id", (req,res) => {
  let id = req.params.id;

  User.findById(id, (err, user) => {
    if (!user)
      return res.status(404).json("User to be activated is not found")
    
    user.active = true;
    user
        .save()
        .then(res.json(user))
        .catch(err => console.log(err))
  })
})

router.post("/setuserdisabled/:id", (req,res) => {
  let id = req.params.id;

  User.findById(id, (err, user) => {
    if (!user)
      return res.status(404).json("User to be disabled is not found")
    
    user.active = false;
    user
        .save()
        .then(res.json(user))
        .catch(err => console.log(err))
  })
})

router.delete("/delete/:id", (req,res) => {
  let userId = req.params.id;
  User.findByIdAndDelete(userId, (err,user) => {
    if (!user)
      return res.status(404).json("User to delete is not found")
    else
      return res.json(user)
  })
})

router.post("/bulkupdateclass", (req, res) => {
  let operations= [];

  let allStudentId = [];
  for (let entries of Object.entries(req.body)) {
    // let classId = ObjectId(entries[0]);
    // let studentIdArray = entries[1].map((id) => {return ObjectId(id)});

    let classId = entries[0];
    let studentIdArray = entries[1];

    for (let studentId of studentIdArray) {
      allStudentId.push(studentId);
    }

    operations.push({
      updateMany: {
        filter: { _id: { $in: studentIdArray } },
        update: { kelas: classId }
      }
    });
  }

  Student.bulkWrite(operations, { ordered: false }).then(() => {
    return res.json("Bulkupdate student class completed");
  }).catch((err) => {
    console.log(err);
    return res.status(500).json(err);
  });
});

module.exports = router;
