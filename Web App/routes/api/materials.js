const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateMaterialInput = require("../../validation/MaterialData");
const Material = require("../../models/Material");

router.post("/create", (req,res) => {

    const { errors, isValid} = validateMaterialInput(req.body);
    console.log(errors)
    if(!isValid) {
        console.log(errors)
        return res.status(400).json(errors);
    }

    //Check Validation
    let class_assigned = req.body.class_assigned;
    let class_assigned_ids = []

    if(class_assigned.length > 0){
        class_assigned.map((kelas) =>
         class_assigned_ids.push(kelas._id))
    }

    const newMaterial = new Material({
        name: req.body.name,
        subject: req.body.subject,
        author_id: req.body.author_id,
        class_assigned: class_assigned_ids,
        description: req.body.description,
        // lampiran: req.body.lampiran
    })

    newMaterial
            .save()
            .then(material => {
                console.log("Material is created")
                res.json(material)})
            .catch(err => console.log(err));
})

router.post("/update/:id", (req,res) => {
    
    const { errors, isValid } = validateMaterialInput(req.body);

    if(!isValid){
        console.log("Not valid lahhh");
        return res.status(400).json(errors);
    }

    let id = req.params.id;

    console.log(req.body);
    Material.findById(id, (err, materialData) => {
        if(!materialData)
            return res.status(404).send("material data is not found");
        else{
            materialData.name = req.body.name;
            materialData.subject = req.body.subject;
            materialData.description = req.body.description;
            materialData.class_assigned = req.body.class_assigned;

            materialData
                    .save()
                    .then(taskData => res.json("Update Task complete"))
                    .catch(err => res.status(400).send("Unable to update task database"));
        }
    })
})

//Define View one material
router.get("/viewOne/:id", (req,res) => {
    console.log("view one is runned")
    let id = req.params.id;
    Material.findById(id, (err, materialData) => {
        if(!materialData)
            return res.status(404).send("material data is not found");
        else {
            console.log("materialnya yang ini: ", materialData)
            return res.json(materialData)
        }
    })
})

//Define View classes route
router.get("/viewall", (req, res) => {
    Material.find({}).then((materials, err) => {
        if(!materials)
            return res.status(400).json("materials are not found");
        else 
            return res.json(materials);
    })
})

router.get("/viewByClass/:id", (req,res) => {
    let id = req.params.id;
    console.log(id)
    console.log("View Material by class is runned")
    // if want to get the MongoDB object that has id element in the array.
    Material.find({ class_assigned: id }, (err, materials) => {
        if(!materials){
            console.log("Not found")
            return res.status(400).json("material with that class is not found");
        }
        console.log("materials: ", materials)
        return res.json(materials)
    })
})

//Define delete routes
router.delete("/delete/:id", (req, res) => {
    Material.findByIdAndRemove(req.params.id)
        .then((materials, err) => {
            if(!materials) {
                res.status(400).json(err);
            } else {
                res.json(materials);
            }
        })
})

module.exports = router;