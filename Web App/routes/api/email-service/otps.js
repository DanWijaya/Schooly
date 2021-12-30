const express = require("express");
const router = express.Router();
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
const otpGenerator = require("otp-generator");
const RegisterOTP = require("../../../models/otp_model/OTPRegister");

// Set the region. HAVE TO SET IT IN THE CONFIG FILE SEPARATELY.
const { SES_CONFIG } = require("../../../config/keys").awsKey;

const ses = new AWS.SES(SES_CONFIG);

// Need to decide the soruce email address for production.
const sourceEmailAddress = "schoolysystem@gmail.com";

function AddMinutesToNow(minutes) {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60000);
}

router.post("/send-otp-registration-email", async (req, res) => {
  try {
    let { email, name } = req.body;
    const minutesToExpire = 3;
    const otpLength = 6;

    email = email.replace(/\s/g, "");
    const generatedOTP = otpGenerator.generate(otpLength, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const foundOTP = await RegisterOTP.findOne({ email: email });
    const expirationTime = AddMinutesToNow(minutesToExpire);
    if (!foundOTP) {
      const newRegisterOTP = new RegisterOTP({
        otp: generatedOTP,
        expiration_time: expirationTime,
        minutes_to_expire: minutesToExpire,
        email: email,
        verified: false,
      });

      await newRegisterOTP.save();
    } else {
      foundOTP.otp = generatedOTP;
      foundOTP.expiration_time = expirationTime;
      foundOTP.minutes_to_expire = minutesToExpire;
      foundOTP.verified = false;

      await foundOTP.save();
    }

    // Create sendEmail params
    var params = {
      Destination: {
        // Email to send TO.
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          email,
          /* more items */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: `Halo <b>${name}</b>, <br/><br/> Kode akun registrasi anda adalah <b>${generatedOTP}</b>. <br/>
            Kode ini berlaku selama ${minutesToExpire} menit. Silahkan memasukkan Kode ini di aplikasi Schooly untuk melanjutkan pendaftaran. 
          `,
          },
          Text: {
            Charset: "UTF-8",
            Data: "Here is an email from AWS SES",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Verifikasi Pendaftaran Schooly",
        },
      },
      //Email to send FROM.
      Source: sourceEmailAddress /* required */,
      // ReplyToAddresses: [
      //   email
      //       ],
    };

    // Create the promise and SES service object
    const data = await ses.sendEmail(params).promise();
    console.log("Send OTP registration email successful");
    return res.json("Send OTP Registration email successful");
  } catch (err) {
    console.error("Send OTP registration email failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

router.post("/verify-otp-registration", async (req, res) => {
  try {
    let { email, otp } = req.body;

    //Get the OTP in DB:
    const foundOTP = await RegisterOTP.findOne({
      email: email,
      // verified: false,
    });
    if (!foundOTP) {
      throw "No corresponding OTP found";
    }

    if (foundOTP.otp !== otp) {
      console.log("OTP is incorrect");
      return res.json({ otpStatus: 2, description: "OTP is incorrect" });
    }

    if (foundOTP.expiration_time <= new Date()) {
      console.log("OTP has expired");
      return res.json({ otpStatus: 3, description: "OTP has expired" });
    }

    if (foundOTP.verified) {
      console.log("OTP has been used");
      return res.json({ otpStatus: 4, description: "OTP has been used" });
    }

    foundOTP.verified = true;
    await foundOTP.save();
    return res.json({
      otpStatus: 1,
      description: "OTP is verified successfully",
    });
  } catch (err) {
    console.error("verify-otp-registration failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

router.post("/send-bulk-otp-registration-email", async (req, res) => {
  try {
    let { emailList, nameList } = req.body;
  } catch (err) {}
});

module.exports = router;
