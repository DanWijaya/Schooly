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
      });

      await newRegisterOTP.save();
    } else {
      foundOTP.otp = generatedOTP;
      foundOTP.expiration_time = expirationTime;
      foundOTP.minutes_to_expire = minutesToExpire;

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
    };

    // Create the promise and SES service object
    const data = await ses.sendEmail(params).promise();
    console.log("Send OTP registration email successful");
    return res.json(data);
  } catch (err) {
    console.error("Send OTP registration email failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

router.post("/verify-register-otp", async (req, res) => {
  try {
    let { email, name, otpInput } = req.body;

    //Get the OTP in DB:
    const foundOTP = await RegisterOTP.findOne({
      email: email,
      verified: false,
    });
    if (otpInput === foundOTP.otp) {
      foundOTP.verified = true;
      await foundOTP.save();
    } else {
      // return error.
    }
  } catch (err) {}
});

router.post("/send-bulk-otp-registration-email", async (req, res) => {
  try {
    let { emailList, nameList } = req.body;
  } catch (err) {}
});
// BELOW IS FOR TESTING WITHOUT API
// Handle promise's fulfilled/rejected states

// Create sendEmail params
// var params = {
//   Destination: {
//     // Email to send TO.
//     /* required */
//     CcAddresses: [
//       /* more items */
//     ],
//     ToAddresses: [
//       "danwijayaa@gmail.com",
//       "daniel.wijaya@anacle.com",
//       "danwijaya19@gmail.com",
//       /* more items */
//     ],
//   },
//   Message: {
//     /* required */
//     Body: {
//       /* required */
//       Html: {
//         Charset: "UTF-8",
//         Data: `Halo <b>Daniel</b>, <br/><br/> Masukkan kode berikut: <b>12341234.</b> Kode ini akan berlaku selama 3 menit.
//       Silahkan memasukkan Kode ini di aplikasi Schooly untuk melanjutkan pendaftaran.
//       `,
//       },
//       Text: {
//         Charset: "UTF-8",
//         Data: "Here is an email from AWS SES",
//       },
//     },
//     Subject: {
//       Charset: "UTF-8",
//       Data: "Verifikasi Pendaftaran Schooly",
//     },
//   },
//   //Email to send FROM.
//   Source: sourceEmailAddress /* required */,
// };

// // Create the promise and SES service object
// const promise = ses.sendEmail(params).promise();
// promise.then((data) => {
//   console.log(data.MessageId);
// });

module.exports = router;
