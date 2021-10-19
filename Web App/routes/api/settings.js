// ikutin format, import" express, import model yang kamu buat tadi dan lain-lain
// pakai router dkk buat post, get dan put, request. Jangan lupa panggil res.json atau res.status(<status_code>).json({..})
// Pakai postman untuk buat setting ini.
// Di dalamnya, kamu pakai Setting.findById dan kawan"... ikutin saja.

const express = require("express");
const router = express.Router();
const Setting = require("../../models/setting/Setting");

router.post("/create", (req, res) => {
  const newSetting = new Setting({
    upload_limit: req.body.upload_limit,
  });
  newSetting
    .save()
    .then((settingData) => {
      console.log("Setting is created");
      return res.status(200).json(settingData);
    })
    .catch((err) => {
      console.error("Unable to create setting");
      return res.status(400).json(err);
    });
});

router.get("/view", (req, res) => {
  console.log("viewing setting");
  Setting.findOne()
    .then((settingData) => {
      if (!settingData) throw "setting is not found";
      return res.json(settingData);
    })
    .catch((err) => {
      console.error("Unable to view the setting");
      res.status(400).json(err);
    });
});

router.put("/update", (req, res) => {
  // console.log("body received: ", req.body);
  Setting.findOne()
    .then((settingData) => {
      if (!settingData) throw "setting is not found";
      settingData.upload_limit = req.body.upload_limit;
      return settingData.save();
    })
    .then((settingData) => res.json("Update Setting complete"))
    .catch((err) => {
      console.error("Unable to update setting");
      res.status(400).send(err);
    });
});

module.exports = router;
