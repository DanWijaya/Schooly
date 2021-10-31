const express = require("express");
const router = express.Router();
const validateEventInput = require("../../validation/EventData");
const Event = require("../../models/Event");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateEventInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newEvent = new Event(req.body);

  newEvent
    .save()
    .then((event) => res.json(event._id))
    .catch((err) => {
      console.error("Create event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewAll/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }

  Event.find({ unit: unitId })
    .then((events) => res.json(events))
    .catch((err) => {
      console.error("View all units failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewOne/:id", (req, res) => {
  Event.findById(req.params.id)
    .then((event) => {
      if (!event) throw "Event not found";
      return res.json(event);
    })
    .catch((err) => {
      console.error("View one event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateEventInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Event.findById(req.params.id, (err, eventData) => {
    if (!eventData) throw "Event to update not found";

    eventData.name = req.body.name;
    eventData.location = req.body.location;
    eventData.start_date = req.body.start_date;
    eventData.end_date = req.body.end_date;
    eventData.to = req.body.to;
    eventData.description = req.body.description;

    return eventData.save();
  })
    .then(() => res.json("Update event completed"))
    .catch((err) => {
      console.error("Update event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  Event.findByIdAndRemove(req.params.id)
    .then((event) => {
      if (!event) throw "Event to delete not found";
      return res.json("Delete event completed");
    })
    .catch((err) => {
      console.error("Delete event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
