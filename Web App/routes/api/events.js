const express = require("express");
const router = express.Router();
const validateEventInput = require("../../validation/EventData");
const Event = require("../../models/Event");

router.post("/create", (req, res) => {
	const { errors, isValid } = validateEventInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newEvent = new Event({
		name: req.body.name,
		description: req.body.description,
		// author_id: req.body.author_id,
		start_date: req.body.start_date,
		end_date: req.body.end_date
	});

	newEvent
		.save()
		.then((event) => res.json(event._id))
		.catch(() => res.status(500).json("Unable to create event"));
});

router.get("/viewAll", (req, res) => {
	Event.find({}).then((events) => {
		res.json(events);
	});
});

router.get("/viewOne/:id", (req, res) => {
	Event.findById(req.params.id, (err, event) => {
		if (!event) {
			return res.status(404).json("Event not found");
		}
		res.json(event);
	});
});

// router.get("/viewByAuthor/:id", (req, res) => {
// 	Event.find({ author_id: req.params.id }, (err, events) => {
// 		if (events.length === 0) {
// 			return res.status(400).json("Event not found");
// 		}
// 		res.json(events);
// 	});
// });

router.post("/update/:id", (req, res) => {
	const { errors, isValid } = validateEventInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	
	Event.findById(req.params.id, (err, eventData) => {
		if (!eventData) {
			return res.status(404).json("Event not found");
		}
		
		eventData.name = req.body.name;
		eventData.description = req.body.description;
		eventData.start_date = req.body.start_date;
		eventData.end_date = req.body.end_date;

		eventData
			.save()
			.then(() => res.json("Update event completed"))
			.catch(() => res.status(500).json("Unable to update event"));
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