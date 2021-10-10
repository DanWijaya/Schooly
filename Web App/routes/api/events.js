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
    .catch(() => res.status(400).json("Unable to create event"));
});

router.get("/viewAll/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Event.find({ unit: unitId })
    .then((events) => res.json(events))
    .catch((err) => res.status(400).json(err));
});

router.get("/viewOne/:id", (req, res) => {
  Event.findById(req.params.id, (err, event) => {
    if (!event) {
      return res.status(404).json("Event not found");
    }
    res.json(event);
  });
});

router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateEventInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Event.findById(req.params.id, (err, eventData) => {
    if (!eventData) {
      return res.status(404).json("Event not found");
    }

    eventData.name = req.body.name;
    eventData.location = req.body.location;
    eventData.start_date = req.body.start_date;
    eventData.end_date = req.body.end_date;
    eventData.to = req.body.to;
    eventData.description = req.body.description;

    eventData
      .save()
      .then(() => res.json("Update event completed"))
      .catch(() => res.status(400).json("Unable to update event"));
  });
});

router.delete("/delete/:id", (req, res) => {
  Event.findByIdAndRemove(req.params.id, (err, event) => {
    if (!event) {
      return res.status(404).json("Event not found");
    }
    res.json("Delete event completed");
  });
});

module.exports = router;
