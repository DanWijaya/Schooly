const avatar = require("../../../routes/api/upload/uploads");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

// const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../../validation/Register");
const validateLoginInput = require("../../../validation/Login");
// const validateUserDataInput = require("../../validation/UserData")

// Load User model
const User= require("../../../models/user_model/User");

// tugas 3 ------------------------------------------------------------------------------------------
const validateUserImport = require("./ImportValidator");

const MockUser = require("./MockUserModel");
const MockStudent = require("./MockStudent");
const MockTeacher = require("./MockTeacher");
// const MockAdmin = require("./MockAdmin");
// ------------------------------------------------------------------------------------------

const Student = require("../../../models/user_model/Student");
const Teacher = require("../../../models/user_model/Teacher");
const Admin = require("../../../models/user_model/Admin");
const Class = require("../../../models/Class")
const { ObjectId } = require("mongodb");
const Validator = require("validator");
const isEmpty = require("is-empty");

// tugas 3 -------------------------------------------------------------------------------------------
router.post("/importUsers", (req, res) => {
	const newUsers = req.body;

	MockUser.find().then((users) => {
		new Promise ((resolve) => {
			resolve(users.map((user) => {
				return(user.email);
			}));
		}).then((usedEmails) => {
			let validUsers = [];
			let invalidUsers = [];
			
			newUsers.forEach((user) => {
				if ( !validateUserImport(user).isValid ) {
					invalidUsers.push(user);
				} else {
					if (usedEmails.includes(user.email)) {
						invalidUsers.push(user);
					} else {
						let newUser;
						// let userCopy = {...user};
						if (user.role === "MockStudent") {
							// delete userCopy.subject_teached;
							newUser = new MockStudent(user);
						} else if (user.role === "MockTeacher") {
							// delete userCopy.kelas;
							newUser = new MockTeacher(user);
						} 
						// else {
						// 	delete userCopy.subject_teached;
						// 	delete userCopy.kelas;
						// 	newUser = new MockAdmin(userCopy);
						// }
		
						validUsers.push(newUser);
					}
				}
			})

			MockUser.insertMany(validUsers).then((result) => {
				return res.status(200).json(`${result.insertedCount} documents were inserted`);
			}).catch((err) => {
				return res.status(400).json(err);
			});
		});
	}).catch((err) => {
		console.log(err);
	});
});

// untuk keperluan testing, endpoint ini tidak dipakai dalam action apapun 
router.get("/getMockUsers", (req, res) => {
	MockUser.find().then((users, err) => {
		if (!users) {
			return res.status(404).json("No students yet in Schooly system");
		} else {
			return res.status(200).json(users);
		}
	}).catch((err) => {
		return res.status(400).json(err);
	});
});

// untuk keperluan testing, endpoint ini tidak dipakai dalam action apapun
router.delete("/deleteAllMockUsers", (req,res) => {
	MockUser.deleteMany().then((result) => {		
		return res.status(200).json(`Deleted all mockuser. ${result.deletedCount} documents were deleted`);
	}).catch((err) => {
		return res.status(400).json(err);
	});
});

//
router.get("/getMockTeachers", (req, res) => {
	MockUser.find({ role: "MockTeacher", active: true }).then((users, err) => {
		if (!users) {
			console.log("No teachers yet in Schooly System");
		} else {
			return res.json(users);
		}
	});
})

//
router.get("/getMockStudents", (req,res) => {
	MockUser.find({ role: "MockStudent", active: true}).then((users, err) => {
		if (!users) {
			console.log("No students yet in Schooly System");
		} else {
			return res.json(users);
		}
	});
});

//
router.post("/setUserDisabled/:id", (req,res) => {
	let id = req.params.id;
	MockUser.findById(id, (err, user) => {
		if (!user) {
			return res.status(404).json("User to be disabled is not found");
		}
		
		user.active = false;
		user
			.save()
			.then(res.json(user))
			.catch(err => console.log(err))
	});
});

//
router.delete("/delete/:id", (req,res) => {
	let userId = req.params.id;
	MockUser.findByIdAndDelete(userId, (err,user) => {
		if (!user) {
			return res.status(404).json("User to delete is not found");
		} else {
			return res.status(200).json(user);
		}
	});
});
module.exports = router;  