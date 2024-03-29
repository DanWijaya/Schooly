const User = require("../../models/user_model/User");
const Class = require("../../models/Class");
const Student = require("../../models/user_model/Student");
const Teacher = require("../../models/user_model/Teacher");
const Admin = require("../../models/user_model/Admin");
const SuperAdmin = require("../../models/user_model/SuperAdmin");
const Validator = require("validator");
const isEmpty = require("is-empty");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const {
  validateRegisterInput1,
  validateRegisterInput2,
} = require("../../validation/Register");
const validateLoginInput = require("../../validation/Login");

const { ObjectId } = require("mongodb");

const sessionExpirySeconds = 604800;
const fieldToInclude = "+password";

router.post("/validateRegister/:pageNum", (req, res) => {
  const { pageNum } = req.params;
  const validateRegisterFunction = (data) => {
    if (pageNum == 1) return validateRegisterInput1(data);
    if (pageNum == 3) return validateRegisterInput2(data);
  };
  const { errors, isValid } = validateRegisterFunction(req.body);
  console.log(isValid);
  if (!isValid) return res.status(400).json(errors);

  return res.json({});
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    // Form validation.
    const { errors: errors1, isValid: isValid1 } = validateRegisterInput1(
      req.body
    );
    const { errors: errors2, isValid: isValid2 } = validateRegisterInput2(
      req.body
    );

    // Check validation.
    if (!isValid1 || !isValid2) throw { ...errors1, ...errors2 };
    // return res.status(400).json({ ...errors1, ...errors2 });

    const user = await User.findOne({ email: req.body.email }).select(
      fieldToInclude
    );
    console.log(req.body);
    if (user) throw { email: "Email sudah terdaftar" };
    let newUser;
    if (req.body.role === "Student") newUser = new Student(req.body);
    else if (req.body.role === "Teacher") newUser = new Teacher(req.body);
    else if (req.body.role === "Admin") newUser = new Admin(req.body);
    else if (req.body.role === "SuperAdmin") newUser = new SuperAdmin(req.body);
    else throw { role: "Peran belum diisi" };
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);

    newUser.password = hash;
    const createdUser = await newUser.save();
    return res.json(createdUser);
  } catch (err) {
    console.error("Register user failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res) => {
  // Form validation.
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation.
    if (!isValid) throw errors;

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email.
    const user = await User.findOne({ email: email })
      .lean()
      .select(fieldToInclude);
    if (!user) throw { email: "Email tidak ditemukan" };
    if (!user.active) throw { email: "Akun ini belum aktif" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { password: "Kata sandi tidak benar" };

    console.log(user);
    var payload = user;
    // No need to delete because default already not showing password.
    // delete payload["password"];

    // Sign token.
    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: sessionExpirySeconds, //31556926 (1 year in seconds)
      },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        }
        console.log("User session updated");
        return res.json({
          success: true,
          token: "Bearer " + token,
        });
      }
    );
  } catch (err) {
    console.error("User Login failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

router.put("/update/data/:id", async (req, res) => {
  try {
    let email = req.body.email;

    if (isEmpty(email)) {
      throw { email: "Email belum diisi" };
    }
    if (!Validator.isEmail(email)) {
      throw { email: "Email tidak benar" };
    }

    let id = req.params.id;
    let user = await User.findById(id);
    if (!user) throw { usernotfound: "Pengguna tidak ditemukan" };

    // Personal Information
    user.name = req.body.nama;
    user.tanggal_lahir = req.body.tanggal_lahir;
    user.jenis_kelamin = req.body.jenis_kelamin;
    user.sekolah = req.body.sekolah;

    // Contacts
    user.email = req.body.email;
    user.phone = req.body.no_telp;
    user.emergency_phone = req.body.no_telp_darurat;
    user.address = req.body.alamat;

    // Career
    user.hobi_minat = req.body.hobi_minat;
    user.ket_non_teknis = req.body.ket_non_teknis;
    user.cita_cita = req.body.cita_cita;
    user.uni_impian = req.body.uni_impian;

    await user.save();
    console.log("Update User data completed");
    // Have to convert it to plain objects.

    var payload = user.toObject();
    delete payload["password"];

    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: sessionExpirySeconds, // 1 year in seconds
      },
      (err, token) => {
        if (err) {
          return res.status(400).json(err);
        }
        console.log("User session updated");
        return res.json({
          success: true,
          token: "Bearer " + token,
        });
      }
    );
  } catch (err) {
    console.error("Update user data failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

router.get("/getTeachers/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Teacher.find({ active: true, unit: unitId })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("No teachers yet in Schooly System");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get teachers failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getStudents/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Student.find({ active: true, unit: unitId })
    .sort({ name: 1 })
    .then((users) => {
      console.log("Ini studentsnya : ", users);
      if (!users.length) console.log("No students yet in Schooly System");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get students failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getAdmins/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Admin.find({ active: true, unit: unitId })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("No unit admins yet in Schooly System");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get admins failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getAllAdmins", (req, res) => {
  Admin.find({ active: true })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("No unit admins yet in Schooly System");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get all admins failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getOneUser/:id", (req, res) => {
  let id = req.params.id;
  if (!id) {
    console.log("Id passed is undefined in getOneUser");
    return res.json({});
  }
  User.findById(id)
    .then((user) => {
      if (!user) throw "No user is found in Database";
      return res.json(user);
    })
    .catch((err) => {
      console.error("Get One user failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getUsers", (req, res) => {
  const { userIds } = req.query;
  console.log("User ids : ", userIds);
  let ids_to_find;

  if (userIds !== undefined) {
    ids_to_find = userIds.map((id) => new ObjectId(id));
  }

  User.find({ _id: { $in: userIds }, active: true })
    .then((users) => {
      console.log("usernya ini : ", users);
      if (!users.length) console.log("Users in the database still empty");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get users with particular ids failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getStudentsByClass/:id", (req, res) => {
  let id = req.params.id;
  Student.find({ kelas: id, active: true })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("No students with this class ID");
      return res.json(users);
    })
    .catch((err) => {
      console.error("Get students by class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getAllUsers/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  User.find({ active: true, unit: req.params.unitId })
    .sort({ name: 1 })
    .lean()
    .then((users) => {
      if (!users.length) console.log("No users yet in this unit");
      return res.json(users);
    })
    .catch((err) => {
      console.error("getAllUsers in unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// for admin only
router.get("/getPendingStudents/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Student.find({ active: false, unit: unitId })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("Pending students in this unit is empty");
      return res.json(users);
    })
    .catch((err) => {
      console.error("getPendingStudents failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getPendingTeachers/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Teacher.find({ active: false, unit: unitId })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("Pending teachers in this unit is empty");
      return res.json(users);
    })
    .catch((err) => {
      console.error("getPendingTeachers in unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/getAllPendingAdmins", (req, res) => {
  Admin.find({ active: false })
    .sort({ name: 1 })
    .then((users) => {
      if (!users.length) console.log("Pending admins in this unit is empty");
      console.log("getAllPendingAdmins completed");
      return res.json(users);
    })
    .catch((err) => {
      console.error("getAllPendingAdmins in unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/setUserActive/:id", (req, res) => {
  let id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (!user) throw "User to be activated is not found";
      user.active = true;
      return user.save();
    })
    .then((user) => {
      console.log("setUserActive completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("setUserActive failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/bulkSetUserActive/", (req, res) => {
  let { id_list } = req.body;
  User.updateMany({ _id: { $in: id_list } }, { active: true })
    .then((user) => {
      if (!user.length) console.log("Users to set active is empty");
      console.log("bulkSetUserActive is completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("bulkSetUserActive failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/setUserDeactivated/:id", (req, res) => {
  let id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (!user) throw "User to be disabled is not found";
      user.active = false;
      return user.save();
    })
    .then((user) => {
      console.log("setUserDeactivated completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("setUserDeactivated failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/bulkSetUserDeactivated/", (req, res) => {
  let { id_list } = req.body;
  User.updateMany({ _id: { $in: id_list } }, { active: false })
    .then((user) => {
      if (!user.length) console.log("Users to deactivate is empty");
      console.log("bulkSetUserDeactivated completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("bulkSetUserDeactivated failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) throw "User to delete is not found";
      return res.json(user);
    })
    .catch((err) => {
      console.error("Delete User failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/bulkDelete", (req, res) => {
  console.log("/bulkDelete is runned");
  let { id_list } = req.body;
  console.log(id_list);
  User.deleteMany({ _id: { $in: id_list } })
    .then((user) => {
      if (!user.length) console.log("Users to delete is empty");
      console.log("bulkDelete completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("bulkDelete failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/classAssignment/:dummyClassId", (req, res) => {
  let operations = [];
  for (let [classId, studentIdArray] of Object.entries(req.body)) {
    operations.push({
      updateMany: {
        filter: { _id: { $in: studentIdArray } },
        update:
          classId === req.params.dummyClassId
            ? { $unset: { kelas: "" } }
            : { kelas: classId },
      },
    });
  }

  Student.bulkWrite(operations, { ordered: false })
    .then(() => {
      return res.json("Bulkupdate student class completed");
    })
    .catch((err) => {
      console.error("Bulkupdate student class failed");
      console.error(err);
      return res.status(500).json(err);
    });
});

router.put("/teacher/:teacherId", (req, res) => {
  User.findById(req.params.teacherId)
    .then((user) => {
      if (!user) {
        throw { usernotfound: "Pengguna tidak ditemukan" };
      }
      user.subject_teached = req.body.subject_teached;
      user.class_teached = req.body.class_teached;
      user.class_to_subject = req.body.class_to_subject;

      return user.save();
    })
    .then((user) => {
      console.log("Update teacher completed");
      return res.json(user);
    })
    .catch((err) => {
      console.error("Update teacher failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/check-email-exist", (req, res) => {
  let { email } = req.query;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.json({ exist: true });
      }
      return res.json({ exist: false });
    })
    .catch((err) => {
      console.error("check-email-exist failed");
      return res.status(400).json(err);
    });
});

//Register Students bulk only
router.post("/registerStudentsBulk", (req, res) => {
  let { classes, users } = req.body;
  let class_map = new Map();
  console.log(classes, users);
  Class.find({ name: { $in: classes } })
    .then((result) => {
      result.forEach((item) => class_map.set(item.name, item._id));
      let user_list = users.map((u) => {
        u.kelas = class_map.get(u.kelas);
        u.active = false;

        return u;
      });
      return User.insertMany(user_list);
    })
    .then((result) => {
      console.log("registerStudentsBulk completed");
      return res.json(result);
    })
    .catch((err) => {
      console.error("registerStudentsBulk failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// SuperAdmin Only
router.put("/updateUnitAdmins", (req, res) => {
  // userToUnit is an object with (key,value) = (userId,unitId).
  let operations = [];
  for (let [adminId, unitId] of Object.entries(req.body)) {
    let updateArgument = {};

    if (adminId) {
      updateArgument = { unit: unitId };
    }

    operations.push({
      updateOne: {
        filter: { _id: adminId },
        update: updateArgument,
      },
    });
  }

  Admin.bulkWrite(operations, { ordered: false })
    .then((result) => {
      console.log("Update Unit Admins completed");
      return res.json(result);
    })
    .catch((err) => {
      console.error("Update Unit Admins failed");
      console.error(err);
      return res.status(500).json(err);
    });
});
module.exports = router;
