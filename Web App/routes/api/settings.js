// ikutin format, import" express, import model yang kamu buat tadi dan lain-lain
// pakai router dkk buat post, get dan put, request. Jangan lupa panggil res.json atau res.status(<status_code>).json({..})
// Pakai postman untuk buat setting ini.  
// Di dalamnya, kamu pakai Setting.findById dan kawan"... ikutin saja. 

const express = require("express");
const router = express.Router();
const Setting = require("../../models/setting/Setting");

router.post("/create", (req,res) => {
  const newSetting = new Setting({
    upload_limit: req.body.upload_limit,
  });
  console.log(newSetting);
  newSetting
    .save()
    .then((setting) => {
      console.log("Setting is created");
      console.log(setting);
      return res.status(200).json(setting);
    })
    .catch((err) => console.log(err));
});

router.get("/view", (req,res) => {
  console.log("viewing setting");
  Setting.findOne().then((setting) => {
    if (!setting) return res.status(400).json("setting is not found");
    else {
      console.log("setting viewed : " , setting);
      return res.status(200).json(setting);
    }
  });
});

router.put("/update", (req,res) => {
  console.log ("body received: ", req.body);
  Setting.findOne().then((settingData, err) => {
    if (!settingData) return res.status(404).send("setting is not found");
    else {
      settingData.upload_limit = req.body.upload_limit;
      settingData
        .save()
        .then((settingData) => res.json("Update Setting complete"))
        .catch((err) => res.status(400).send("Unable to update setting database"));
    }
  });
});

module.exports = router;