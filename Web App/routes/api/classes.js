const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation 
const validateClassInput = require("../../validation/classdata");

//Load Class Model 
const Class = require("../../models/Class");

router.post("/create", (req, res) => {

    const { errors, isValid } = validateClassInput(req.body);

    if(!isValid) {
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

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    Class.findById(id, (classes,err) => {
        if(!classes){
            return res.status(400).json("Class does not exist");
        } else {
            console.log(kelas);
            res.json(classes);
        }
    });
});

router.get('/update/:id', (req,res) => {
    let id = req.params.id;
    Class.findById(id)
        .then((classes, err) => {
        if(!classes){
            return res.status(400).json("Class to update not found");
        }
        else {
            classes.name = req.body.name;
            classes.walikelas = req.body.walikelas;
            classes.nihil = req.body.nihil;
            classes.ukuran = req.body.ukuran;

            classes.save().then(classes => {
                res.json("Edit completed");
            })
            .catch(err => {
                res.status(400).send("Undable to edit the database");
            })
        }
    })
})

// router.route('/edit/:id').get((req, res) => {
//     let id = req.params.id;
//     Class.findById(id, (classes, err) => {
//         res.json(classes);
//     });
// });

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

module.exports = router;
