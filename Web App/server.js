const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const multer = require("multer");

const users = require("./routes/api/Users");
const tasks = require("./routes/api/Tasks");
const classes = require("./routes/api/Classes");

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
// Routes
app.use(cors());

app.use("/api/users", users);
app.use("/api/tasks", tasks);
app.use("/api/classes", classes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

// Below are testing to implement the Image upload
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require("multer-gridfs-storage")
const GridFsStream = require("gridfs-stream");
const methodOverride = require("method-override")
// app.set('view engine', 'ejs');

// Initialize gfs 
let gfs;
conn.once('open', () => {
  // Initialize Stream
  gfs = GridFsStream(conn.db, mongoose.mongo);
  gfs.collection('uploads')
  // all set!
})

// Create storage engine
var storage = new GridFsStorage({
  url: db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

// Create the middleware which facilitates file uploads
const upload = multer({ storage });


app.get('/image-upload', (req,res) => {
  console.log("AA")
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('image-upload', {files: false})
    } else {
      files.map(file => {
        if(file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'img/jpg')
        {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('image-upload', {files: false})
    }

    // Files exist
    return res.json(files);
  });
})
// @route POST /upload
// @desc Upload files to DB
app.post('/upload', upload.single('avatar'), (req,res) => {
  // res.json({ file: req.file});
  res.redirect('/image-upload')
});

// @route GET /files
// @desc Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

//pakai read stream utk display imagenya di browser

// @route GET /files/:filename
// @desc  Display single file object
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Check if Image
    if (file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'img/jpg') {
      // Show outputnya di browser kita
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res)
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});