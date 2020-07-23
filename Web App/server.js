const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//untuk users punya
const users = require("./routes/api/Users");

// untuk uploads punya
const att_announcement = require("./routes/api/upload/att_announcement");
const att_material = require("./routes/api/upload/att_material");
const att_task = require("./routes/api/upload/att_task");
const file_tugas = require("./routes/api/upload/file_tugas");
const avatar = require("./routes/api/upload/avatar");

// untuk objects punya
const tasks = require("./routes/api/Tasks");
const classes = require("./routes/api/Classes");
const subjects = require("./routes/api/subjects");
const authentication = require('./routes/api/authentication');
const announcements = require("./routes/api/announcements");
const materials = require('./routes/api/materials');

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// // for parsing application/json
// app.use(express.json()); 

app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("MongoDB successfully connected")
  }
    )
  .catch(err => console.log(err));

// Mutler Middleware
app.use(express.static("public"))


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
console.log("Check routes");

// Routes
app.use("/api/users", users);
app.use("/api/tasks", tasks);
app.use("/api/classes", classes);

// Handle upload routing..
app.use("/api/upload/att_announcement", att_announcement)
app.use("/api/upload/att_material", att_material)
app.use("/api/upload/att_task", att_task);
app.use("/api/upload/file_tugas", file_tugas);
app.use("/api/upload/avatar", avatar.router)

app.use("/api/subjects", subjects);
app.use("/api/authentication", authentication)
app.use("/api/announcements", announcements)
app.use("/api/materials", materials)
// Always put this in the end
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
