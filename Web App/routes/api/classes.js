const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load Class Model 
const Class = require("../../models/Class");

router.post("/create", (req, res) => {

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

router.post("/view", (req, res) => {
    Class.findOne({ name: req.body.name}).then(kelas => {
        if(!kelas){
            return res.status(404).json("Class does not exist");
        } else {
            const payload = {
                name: req.body.name,
                walikelas: req.body.walikelas,
                nihil: req.body.nihil,
                ukuran: req.body.ukuran,
            }

            res.json(payload);
        }
    });
});

module.exports = router;
