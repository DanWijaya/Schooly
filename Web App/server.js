const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const multer = require("multer");

const users = require("./routes/api/Users");
const tasks = require("./routes/api/Tasks");
const classes = require("./routes/api/Classes");
const uploads = require('./routes/api/uploads');

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
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

// Create Mongo Connection 
const conn = mongoose.createConnection(db)

// Mutler Middleware
app.use(express.static('public'))


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
console.log("Check routes");

// Below are testing to implement the Image upload


// Routes

app.use("/api/users", users);
app.use("/api/tasks", tasks);
app.use("/api/classes", classes);
app.use("/api/uploads", uploads.router)

// Always put this in the end
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

