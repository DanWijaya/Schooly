require("dotenv").config({ path: `${__dirname}/.env` }); // set the path inside the parameter.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
//untuk users punya
const users = require("./routes/api/users");

// untuk files punya
const fileMaterials = require("./routes/api/files/fileMaterials");
const fileAnnouncements = require("./routes/api/files/fileAnnouncements");
const fileTasks = require("./routes/api/files/fileTasks");
const fileSubmitTasks = require("./routes/api/files/fileSubmitTasks");
const fileAvatar = require("./routes/api/files/fileAvatar");
const fileAssessments = require("./routes/api/files/fileAssessments");
const fileEvents = require("./routes/api/files/fileEvents");

// untuk objects punya
const tasks = require("./routes/api/tasks");
const classes = require("./routes/api/classes");
const subjects = require("./routes/api/subjects");
const authentication = require("./routes/api/authentication");
const announcements = require("./routes/api/announcements");
const materials = require("./routes/api/materials");
const assessments = require("./routes/api/assessments");
const events = require("./routes/api/events");
const units = require("./routes/api/units");

// untuk setting
const settings = require("./routes/api/settings");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// for parsing application/json
// app.use(express.json());

app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
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

//Handle files routing
app.use("/api/files/materials", fileMaterials);
app.use("/api/files/announcements", fileAnnouncements);
app.use("/api/files/tasks", fileTasks);
app.use("/api/files/submit_tasks", fileSubmitTasks);
app.use("/api/files/avatar", fileAvatar);
app.use("/api/files/assessments", fileAssessments);
app.use("/api/files/events", fileEvents);

//Handle object routing
app.use("/api/subjects", subjects);
app.use("/api/authentication", authentication);
app.use("/api/announcements", announcements);
app.use("/api/materials", materials);
app.use("/api/assessments", assessments);
app.use("/api/events", events);

//Handle setting routing
app.use("/api/settings", settings);

app.use("/api/units", units);
// Always put this in the end
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
