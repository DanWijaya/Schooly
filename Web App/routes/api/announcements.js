const Announcement = require("../../models/Announcement");
const User = require("../../models/user_model/User");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateAnnouncementInput = require("../../validation/AnnouncementData");
const { ObjectId } = require("mongodb");

router.post("/create", (req, res) => {
  // Form validation.
  const { errors, isValid } = validateAnnouncementInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let class_assigned = req.body.class_assigned;
  let class_assigned_ids = [];
  if (class_assigned.length > 0) {
    if (class_assigned[0] === null) {
      class_assigned_ids.push(null);
    } else {
      class_assigned.forEach((kelas) => class_assigned_ids.push(kelas));
    }
  }

  const newAnnouncement = new Announcement({
    title: req.body.title,
    description: req.body.description,
    class_assigned: class_assigned_ids,
    author_id: req.body.author_id,
    to: req.body.to,
    unit: req.body.unit,
    // date_announced: new Date()
  });
  newAnnouncement
    .save()
    .then((ann) => res.json(ann))
    .catch((err) => {
      console.error("Create announcement failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define update routing.
router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateAnnouncementInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let id = req.params.id;

  console.log(req.body);
  Announcement.findById(id)
    .then((announcementData) => {
      if (!announcementData) {
        throw "Announcement data is not found";
      }
      announcementData.title = req.body.title;
      announcementData.description = req.body.description;
      announcementData.class_assigned = req.body.class_assigned;
      announcementData.to = req.body.to;

      return announcementData.save();
    })
    .then((announcementData) => res.json("Done with updating announcement"))
    .catch((err) => {
      console.error("Update announcement failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define view one announcement.
router.get("/viewOne/:id", (req, res) => {
  console.log("view one is runned");
  let id = req.params.id;
  Announcement.findById(id)
    .then((announcementData) => {
      if (!announcementData) {
        throw "Announcement data is not found";
      }
      return res.json(announcementData);
    })
    .catch((err) => {
      console.error("View one announcement failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewall/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Announcement.find({ unit: unitId })
    .then((announcements) => {
      if (!announcements.length) {
        throw "All Announcements are not found";
      }
      return res.json(announcements);
    })
    .catch((err) => {
      console.error("View all announcements failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewAdmin/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Announcement.aggregate([
    { $match: { unit: ObjectId(unitId) } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "author_id",
        foreignField: "_id",
        as: "author_info",
      },
    },
  ])
    .then((result) => {
      return res.json(
        result.filter((ann) => {
          return ann.author_info[0].role === "Admin";
        })
      );
    })
    .catch((err) => {
      console.error("View announcement by admin failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Search announcement by author.
router.get("/view/:id", (req, res) => {
  console.log("View announcement is runned");
  let id = req.params.id;

  Announcement.find({ author_id: id })
    .then((announcements) => {
      if (!announcements.length) {
        console.log("Announcement is not found");
      }
      return res.json(announcements);
    })
    .catch((err) => {
      console.error("View announcement by author failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewByClass/:id", (req, res) => {
  let id = req.params.id;
  // If want to get the MongoDB object that has id element in the array.

  Announcement.find({ class_assigned: id })
    .then((announcements) => {
      if (!announcements.length) {
        console.log("Announcement assigned to the class is not found");
      }
      console.log("Announcements: ", announcements);
      return res.json(announcements);
    })
    .catch((err) => {
      console.error("View announcement by class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define delete routes.
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  Announcement.findByIdAndRemove(req.params.id)
    .then((announcements) => {
      if (!announcements) {
        throw "Announcement is not found";
      }
      return res.json(announcements);
    })
    .catch((err) => {
      console.error("Delete announcement failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
