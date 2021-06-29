require("dotenv").config({ path: `${__dirname}/.env` }); // set the path inside the parameter.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//untuk users punya
const users = require("./routes/api/users");
const mockusers = require("./client/src/prototypes/mock-users/mockusers");

// untuk uploads punya
const att_announcement = require("./routes/api/upload/att_announcement");
const att_assessment = require("./routes/api/upload/att_assessment");
const att_material = require("./routes/api/upload/att_material");
const att_task = require("./routes/api/upload/att_task");
const file_tugas = require("./routes/api/upload/file_tugas");
const avatar = require("./routes/api/upload/avatar");

// untuk files punya
const file_materials = require("./routes/api/files/file_materials");
const file_announcements = require("./routes/api/files/file_announcements");
const file_tasks = require("./routes/api/files/file_tasks");
const file_submit_tasks = require("./routes/api/files/file_submit_tasks");
const file_avatar = require("./routes/api/files/file_avatar");
const file_assessments = require("./routes/api/files/file_assessments");
const file_events = require("./routes/api/files/file_events");

// untuk objects punya
const tasks = require("./routes/api/tasks");
const classes = require("./routes/api/classes");
const subjects = require("./routes/api/subjects");
const authentication = require("./routes/api/authentication");
const announcements = require("./routes/api/announcements");
const materials = require("./routes/api/materials");
const assessments = require("./routes/api/assessments");
const events = require("./routes/api/events");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// // for parsing application/json
// app.use(express.json());

app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((err) => console.log(err));

// Mutler Middleware
app.use(express.static("public"));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./passport")(passport);
console.log("Check routes");
// Routes

app.use("/api/users", users);
app.use("/api/tasks", tasks);
app.use("/api/classes", classes);

app.use("/api/mockusers", mockusers);

// Handle upload routing..
app.use("/api/upload/att_announcement", att_announcement);
app.use("/api/upload/att_assessment", att_assessment);
app.use("/api/upload/att_material", att_material);
app.use("/api/upload/att_task", att_task);
app.use("/api/upload/file_tugas", file_tugas);
app.use("/api/upload/avatar", avatar.router);

//Handle files routing
app.use("/api/files/materials", file_materials);
app.use("/api/files/announcements", file_announcements);
app.use("/api/files/tasks", file_tasks);
app.use("/api/files/submit_tasks", file_submit_tasks);
app.use("/api/files/avatar", file_avatar);
app.use("/api/files/assessments", file_assessments);
app.use("/api/files/events", file_events);

//Handle object routing
app.use("/api/subjects", subjects);
app.use("/api/authentication", authentication);
app.use("/api/announcements", announcements);
app.use("/api/materials", materials);
app.use("/api/assessments", assessments);
app.use("/api/events", events);

// Always put this in the end
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
