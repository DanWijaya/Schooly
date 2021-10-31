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
    return res.status(400).json(errors);
  }

  const newUnit = new Unit(req.body);
  newUnit
    .save()
    .then((unit) => res.json(unit))
    .catch((err) => {
      console.error("Create unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/update", (req, res) => {
  const { errors, isValid } = validateUnitInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }
  let { _id, name, description } = req.body;

  Unit.findById(_id)
    .then((unitData) => {
      if (!unitData) {
        throw "Unit data is not found";
      }
      unitData.name = name;
      unitData.description = description;
      return unitData.save();
    })
    .then((unit) => {
      return res.json(unit);
    })
    .catch((err) => {
      console.error("Update unit failed");
      console.error(err);
      return res.status(400).send(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let { id } = req.params;
  Unit.findByIdAndRemove(id)
    .then((unit) => {
      console.log("Delete unit completed");
      return res.json(unit);
    })
    .catch((err) => {
      console.error("Delete Unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewall", (req, res) => {
  Unit.find({})
    .then((units) => {
      console.log("View all units completed");
      return res.json(units);
    })
    .catch((err) => {
      console.error("View all units failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewallmap", (req, res) => {
  Unit.find({})
    .then((units) => {
      let map = {};
      units.map((u) => (map[u._id] = u.name));
      return res.json(map);
    })
    .catch((err) => {
      console.error("View all units in map failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/view/:id", (req, res) => {
  let { id } = req.params;
  Unit.findById(id)
    .then((unit) => {
      if (!unit) {
        throw "Unit not found";
      }
      return res.json(unit);
    })
    .catch((err) => {
      console.error("View Unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
