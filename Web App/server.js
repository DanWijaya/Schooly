const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/Users");
const tasks = require("./routes/api/Tasks");
const classes = require("./routes/api/Classes");
const uploads = require("./routes/api/uploads");
const otps = require("./routes/api/otps");
const subjects = require("./routes/api/subjects");
const authentication = require('./routes/api/authentication');

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
app.use("/api/uploads", uploads.router)
app.use("/api/otps", otps)
app.use("/api/subjects", subjects);
app.use("/api/authentication", authentication)

// Always put this in the end
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));