const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MockUser = require("./MockUserModel");
const { ObjectId } = require("mongodb");

const MockStudent = MockUser.discriminator("MockStudent", new mongoose.Schema({
    kelas: { type: ObjectId, ref: "classes", required: true}, 
    // mau perbaiki ini.
    tugas: [
        {
          id:
              { type : ObjectId, default: null}
          ,
          filename:
              {type: String, default: null}
        ,
          for_task_object: { type: ObjectId, default: null}
        ,
            ontime: { type: Boolean }
        },
        ]
    })
);

module.exports = mongoose.model("MockStudent")