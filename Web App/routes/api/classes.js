const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const mongoose = require("mongoose");

//Load input validation 
const validateClassInput = require("../../validation/ClassData");

//Load Class Model 
const Class = require("../../models/Class");
const User = require("../../models/user_model/User")

router.post("/create", (req, res) => {

    const { errors, isValid } = validateClassInput(req.body);

    if(!isValid) {
        console.log("Not valid");
        return res.status(400).json(errors);
    }

    Class.findOne({ name: req.body.name}).then(kelas => {
        if(kelas) {
            return res.status(400).json({ name: "Class name already exists"});

        } else {
            const newKelas = new Class({
                name: req.body.name,
                walikelas: req.body.walikelas,
                nihil: req.body.nihil,
                ukuran: req.body.ukuran,
            })

            newKelas
                .save()
                .then(kelas => res.json(kelas))
                .catch(err => console.log(err));
        }
    });
});
router.get("/view/:id", (req, res) => {

    Class.findById(req.params.id).then(kelas => {
        if(!kelas){
            return res.status(400).json("Class does not exist");
        } else {
            // console.log(kelas);
            res.json(kelas);
        }
    });
});


router.get("/viewall", (req, res) => {
    Class.find({ }).then((classes, err) => {
        if(!classes)
            res.status(400).json(err);
        else 
            res.json(classes);
    });
});

router.delete("/delete/:id", (req, res) => {
    Class.findByIdAndRemove(req.params.id)
        .then((classes, err) => {
            if(!classes) {
                res.status(400).json(err);
            } else {
                res.json(classes);
            }
        })
})

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);
    Class.findById(id, (err, classData) => {
        res.json(classData)
    });
})

router.post("/update/:id", (req,res) => {
    let id = req.params.id;
    Class.findById(id, (err, classData) => {

        if(!classData){
            return res.status(400).json("Class to update not found");
        }
// Initially there is else block
        classData.name = req.body.name;
        classData.walikelas = req.body.walikelas;
        classData.nihil = req.body.nihil;
        classData.ukuran = req.body.ukuran;
        console.log(req.body.walikelas)

        User.findById(req.body.walikelas,(err, user) => {
            if(!user){
                res.json("User not found")
            } else {
                classData.walikelas = user;
                console.log("User is found")
                console.log(classData.walikelas, "user updated")
            }
        })

        User.findById(req.body.sekretaris,(err, user) => {
            if(!user){
                res.json("User not found")
            } else {
                classData.sekretaris = user;
                console.log("User is found")
                console.log(classData.sekretaris, "user updated")
            }
        })
        
        User.findById(req.body.bendahara,(err, user) => {
            if(!user){
                res.json("User not found")
            } else {
                classData.bendahara = user;
                console.log("User is found")
                console.log(classData.bendahara, "user updated")
            }
        }) 

        User.findById(req.body.ketua_kelas,(err, user) => {
            if(!user){
                res.json("User not found")
            } else {
                classData.ketua_kelas = user;
                console.log("User is found")
                console.log(classData.ketua_kelas, "user updated")
            }
        }).then(() => {classData.save()
                            .then(() => {res.json("Done") 
                            console.log("Update class completed")}
                            )
                            .catch(console.log("Unable to update class Database"))
                            } 
    )
})
})

module.exports = router;