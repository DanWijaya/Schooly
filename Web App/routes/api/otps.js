const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const shortid = require('shortid')

const mailSender = require("../../mail/mailSender")
const OTP = require("../../models/OTP")

router.route("/visitor/:id").put((req,res, next) => {
    let visitorData = req.body;
    let visitorEmail = req.body.email;
    let latestOtp = [];

    function findLatestOTP(mongoCollection, callback){
        mongoCollection
            .find({ visitor_email: visitorEmail})
            .limit(1)
            .sort({ createdAt: -1})
            .exec((err, record) => {
                if (err) {
                    console.log(err);
                  } else {
                    latestOtp.push(record[0].generated_otp);
                    callback();
                  }
            });
    }

    findLatestOTP(OTP, function() {
        if(req.body.otpReceivedByVisitor !== latestOtp[0]) {
            return res  
                    .status(401)
                    .send({ success: false, msg: "Incorrect code was input"});

        } else {
            // allow the user to register
        }
    })
})

router.route("/sendotptovisitor").post((req, res, next) => {
    let visitorEmail = req.body.company_email;
    let newGeneratedOTP = shortid.generate();
  
    // create the otp and mongo-related data for saving into OTP mongo schema
    let thisOTP_Mongo = {
      visitor_email: visitorEmail,
      generated_otp: newGeneratedOTP
    };
    let otpSavedinMongo = new OTP(thisOTP_Mongo);
    otpSavedinMongo.save(async (err, newCode) => {
      try {
        await mailSender.sendOTPToVisitor(visitorEmail, newGeneratedOTP);
        res.status(200).send(newCode);
      } catch (err) {
        console.log("Error while sending email is ", err);
      }
    });
  });

module.exports = router;