const Setting = require("../../models/setting/Setting");
const express = require("express");
const router = express.Router();

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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      res.status(400).send(err);
    });
});

module.exports = router;
