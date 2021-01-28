const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateAnnouncementInput = require("../../validation/AnnouncementData");

const Announcement = require("../../models/Announcement");
const User = require("../../models/user_model/User");

router.post("/create", (req, res) => {
  // Form Validation
  const { errors, isValid } = validateAnnouncementInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  let class_assigned = req.body.class_assigned;
  let class_assigned_ids = [];
  if (class_assigned.length > 0) {
    if (class_assigned[0] === null) {
      class_assigned_ids.push(null);
    } else {
      class_assigned.map((kelas) => class_assigned_ids.push(kelas._id));
    }
  }
  console.log(class_assigned_ids);

  const newAnnouncement = new Announcement({
    title: req.body.title,
    description: req.body.description,
    class_assigned: class_assigned_ids,
    author_id: req.body.author_id,
    to: req.body.to
    // date_announced: new Date()
  });
  newAnnouncement
    .save()
    .then((ann) => {
      res.json(ann);
      console.log("Announcement is created");
    })
    .catch((err) => console.log(err));
});

//Define Update routing.
router.post("/update/:id", (req, res) => {
  const { errors, isValid } = validateAnnouncementInput(req.body);

  if (!isValid) {
    console.log("Not valid lahhh");
    return res.status(400).json(errors);
  }

  let id = req.params.id;

  console.log(req.body);
  Announcement.findById(id, (err, announcementData) => {
    if (!announcementData)
      return res.status(404).send("Announcement data is not found");
    else {
      announcementData.title = req.body.title;
      announcementData.description = req.body.description;
      announcementData.class_assigned = req.body.class_assigned;
      announcementData.to = req.body.to;

      announcementData
        .save()
        .then((taskData) => res.json("Update Task complete"))
        .catch((err) => res.status(400).send("Unable to update task database"));
    }
  });
});

//Define View one announcement
router.get("/viewOne/:id", (req, res) => {
  console.log("view one is runned");
  let id = req.params.id;
  Announcement.findById(id, (err, announcementData) => {
    if (!announcementData)
      return res.status(404).send("Announcement data is not found");
    else {
      console.log("Announcementnya yang ini: ", announcementData);
      return res.json(announcementData);
    }
  });
});

//Define View classes route
router.get("/viewall", (req, res) => {
  Announcement.find({}).then((announcements, err) => {
    if (!announcements)
      return res.status(400).json("Announcements are not found");
    else return res.json(announcements);
  });
});

router.get("/viewAdmin", (req, res) => {
  Announcement.aggregate([
    {
      $lookup: {
        from: User.collection.name,
        localField: "author_id",
        foreignField: "_id",
        as: "author_info"
      }
    },
  ]).then((result) => {
    res.json(result.filter((ann) => {
      return (ann.author_info[0].role === "Admin");
    }));
  }).catch(() => {
    res.status(500).json(err);
  });
});

// Search announcement by author.
router.get("/view/:id", (req, res) => {
  console.log("View announcement is runned");
  let id = req.params.id;
  Announcement.find({ author_id: id }).then((announcements, err) => {
    if (!announcements) {
      console.log("announcement is not found");
      return res.status(400).json("Announcements are not found");
    } else {
      // console.log(announcements);
      return res.json(announcements);
    }
  });
});

router.get("/viewByClass/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  console.log("View announcement by class is runned");
  // if want to get the MongoDB object that has id element in the array.
  Announcement.find({ class_assigned: id }, (err, announcements) => {
    if (!announcements) {
      console.log("Not found");
      return res.status(400).json("Announcement with that class is not found");
    }
    console.log("Announcements: ", announcements);
    return res.json(announcements);
  });
});

//Define delete routes
router.delete("/delete/:id", (req, res) => {
  Announcement.findByIdAndRemove(req.params.id).then((announcements, err) => {
    if (!announcements) {
      res.status(400).json(err);
    } else {
      res.json(announcements);
    }
  });
});

module.exports = router;
