const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const Student = User.discriminator("Student", new mongoose.Schema({
    kelas: { type: Object, ref: "classes"},
    tugas: [
        {
          id:
              { type : String, default: null}
          ,
          filename:
              {type: String, default: null}
        ,
          for_task_object: { type: String, default: null}
        ,
            ontime: { type: Boolean }
        },
        ]
    })
);

module.exports = mongoose.model("Student")
