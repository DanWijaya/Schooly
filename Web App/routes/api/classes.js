const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation 
const validateClassInput = require("../../validation/ClassData");

//Load Class Model 
const Class = require("../../models/Class");

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


router.get('/viewall', (req, res) => {
    Class.find({}).then((classes, err) => {
        if(!classes)
            res.status(400).json(err);
        else 
            res.json(classes);
    });
});

router.delete('/delete/:id', (req, res) => {
    Class.findByIdAndRemove(req.params.id)
        .then((classes, err) => {
            if(!classes) {
                res.status(400).json(err);
            } else {
                res.json(classes);
            }
        })
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    Class.findById(id, (err, classData) => {
        res.json(classData)
    });
})

router.post('/update/:id', (req,res) => {
    let id = req.params.id;
    Class.findById(id, (err, classData) => {
        if(!classData){
            return res.status(400).json("Class to update not found");
        }
        else {
            classData.name = req.body.name;
            classData.walikelas = req.body.walikelas;
            classData.nihil = req.body.nihil;
            classData.ukuran = req.body.ukuran;

            classData
                .save()
                .then(() => res.json("Update class completed"))
                .catch(err => res.status(400).send("Unable to update class Database"));
        }      
    })
})

module.exports = router;