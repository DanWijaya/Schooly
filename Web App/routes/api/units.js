const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateUnitInput = require("../../validation/UnitData");
const Unit = require("../../models/Unit");

const mongoose = require("mongoose");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateUnitInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  const newUnit = new Unit(req.body);
  newUnit
    .save()
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).send("Unable to create unit"));
});

router.put("/update", (req, res) => {
  const { errors, isValid } = validateUnitInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }
  let { _id, name, description } = req.body;

  Unit.findById(_id, (err, unitData) => {
    if (!unitData) return res.status(404).send("Unit data is not found");
    else {
      unitData.name = name;
      unitData.description = description;

      unitData
        .save()
        .then((unit) => res.json(unit))
        .catch(() => res.status(400).send("Unable to update the unit"));
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  let { id } = req.params;
  Unit.findByIdAndRemove(id, (err, units) => {
    if (!units) {
      return res.status(400).json("Unit to delete is not found");
    } else {
      return res.json(units);
    }
  });
});

router.get("/viewall", (req, res) => {
  Unit.find({}, (err, units) => {
    console.log(units);
    return res.json(units);
  });
});

router.get("/viewallmap", (req, res) => {
  Unit.find({}, (err, units) => {
    let map = {};
    units.map((u) => (map[u._id] = u.name));
    return res.json(map);
  });
});
router.get("/view/:id", (req, res) => {
  let { id } = req.params;
  Unit.findById(id, (err, unit) => {
    if (!unit) {
      return res.status(400).json("Unit to delete is not found");
    }
    return res.json(unit);
  });
});

module.exports = router;
