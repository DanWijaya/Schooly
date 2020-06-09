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
    console.log(req.params.id, " testing woi")
    Class.findByIdAndRemove(req.params.id)
        .then((classes, err) => {
            if(!classes) {
                return res.status(400).json(err);
            } else {
                console.log(classes)
                return res.json("Successfully deleted the class")
            }
        })
        // .catch(res.json("Error happened"))
    
    
})

router.get("/viewOneClass/:id", (req, res) => {
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

        // Pipeline on how to create a Async functions to be Synchronous function call
        //Step 1: declare promise
        var myPromise = (id) => {
            return new Promise((resolve, reject) => {
                User.findById(id, (err, user) => {
                    if(!user){
                        reject(err)
                    } else {
                        resolve(user);
                    }
                })
            })
        }

        //Step 2: async promise handler
        var callMyPromise = async () => {
            var walikelas_data = await(myPromise(req.body.walikelas));
            var sekretaris_data = await(myPromise(req.body.sekretaris));
            var bendahara_data = await(myPromise(req.body.bendahara));
            var ketua_kelas_data = await(myPromise(req.body.ketua_kelas));

            classData.walikelas = walikelas_data
            classData.sekretaris = sekretaris_data
            classData.bendahara = bendahara_data
            classData.ketua_kelas = ketua_kelas_data

            // classData.save()
            return classData;
        }

        //Step 3 : Make the call
        callMyPromise().then(function(classData) {

            classData.save()
            res.json("Done")
         });


})
})

module.exports = router;