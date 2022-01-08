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
  // I think might be better to use template to send instead to make it consistent for bulk as well.
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

router.post("/create-email-template", async (req, res) => {
  const params = {
    Template: {
      TemplateName: "MyTemplate",
      SubjectPart: "Hi, {{name}} marked {{active_status}}",
      HtmlPart:
        "<div style='position: absolute;top: center; left:center; border:1px solid red;padding:20px;'><h4>Hello</h4><br>User marked <span style='color:red'>{{active_status}}</span> by {{changedByName}}.<br><br><p>Emp Name : <b>{{name}}</b></p><br><p>Emp Code : <b>{{emp_code}}</b></p></div>",
      TextPart:
        "Hello,\r\nUser marked {{active_status}} by {{changedByName}}.\r\n \r\nEmp Name : {{name}}\r\nEmp Code : {{emp_code}}",
    },
  };
  await ses.createTemplate(params).promise();
  return res.json("Create Email Template is successful");
});

router.post("/send-bulk-otp-registration-email", async (req, res) => {
  // MUST USE BULK TEMPLATE SEND EMAIL ACTUALLY.
  try {
    // send the email in JSON format. (key, val) = (email, name)
    let { emailToNameJSON } = req.body;
    const minutesToExpire = 3;
    const otpLength = 6;

    const generatedOTP = otpGenerator.generate(otpLength, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const emailList = Object.keys(emailToNameJSON);

    var params = {
      Destinations: [
        /* required */
        {
          Destination: {
            /* required */ BccAddresses: [],
            CcAddresses: [],
            ToAddresses: ["STRING_VALUE"],
          },
          ReplacementTags: [
            {
              Name: "STRING_VALUE" /* required */,
              Value: "STRING_VALUE" /* required */,
            },
            /* more items */
          ],
          ReplacementTemplateData: "STRING_VALUE",
        },
        /* more items */
      ],
      Source: "STRING_VALUE" /* required */,
      Template: "STRING_VALUE" /* required */,
      ConfigurationSetName: "STRING_VALUE",
      DefaultTags: [
        {
          Name: "STRING_VALUE" /* required */,
          Value: "STRING_VALUE" /* required */,
        },
        /* more items */
      ],
      DefaultTemplateData: "STRING_VALUE",
      ReplyToAddresses: [
        "STRING_VALUE",
        /* more items */
      ],
      ReturnPath: "STRING_VALUE",
      ReturnPathArn: "STRING_VALUE",
      SourceArn: "STRING_VALUE",
      TemplateArn: "STRING_VALUE",
    };
    await ses.sendEmail(params).promise();
    return res.json("Send Bulk Registration to emails complete");
    // emailList.map((email) => {
    //   return new Promise(async (resolve, reject) => {
    //     const foundOTP = await RegisterOTP.find({ email: email });
    //     const expirationTime = AddMinutesToNow(minutesToExpire);

    //     if (!foundOTP) {
    //       const newRegisterOTP = new RegisterOTP({
    //         otp: generatedOTP,
    //         expiration_time: expirationTime,
    //         minutes_to_expire: minutesToExpire,
    //         email: email,
    //         verified: false,
    //       });

    //       await newRegisterOTP.save();
    //     } else {
    //       foundOTP.otp = generatedOTP;
    //       foundOTP.expiration_time = expirationTime;
    //       foundOTP.minutes_to_expire = minutesToExpire;
    //       foundOTP.verified = false;

    //       await foundOTP.save();
    //     }

    //     // Create sendEmail params
    //     const name = emailToNameJSON[email];
    //     var params = {
    //       Destination: {
    //         // Email to send TO.
    //         /* required */
    //         CcAddresses: [
    //           /* more items */
    //         ],
    //         ToAddresses: emailList,
    //       },
    //       Message: {
    //         /* required */
    //         Body: {
    //           /* required */
    //           Html: {
    //             Charset: "UTF-8",
    //             Data: `Halo <b>${name}</b>, <br/><br/> Kode akun registrasi anda adalah <b>${generatedOTP}</b>. <br/>
    //             Kode ini berlaku selama ${minutesToExpire} menit. Silahkan memasukkan Kode ini di aplikasi Schooly untuk melanjutkan pendaftaran.
    //           `,
    //           },
    //           Text: {
    //             Charset: "UTF-8",
    //             Data: "Here is an email from AWS SES",
    //           },
    //         },
    //         Subject: {
    //           Charset: "UTF-8",
    //           Data: "Verifikasi Pendaftaran Schooly",
    //         },
    //       },
    //       //Email to send FROM.
    //       Source: sourceEmailAddress /* required */,
    //       // ReplyToAddresses: [
    //       //   email
    //       //       ],
    //     };
    //     const data = await ses.sendBulkTemplatedEmail(params).promise();
    //     console.log("Send OTP registration successful");
    //   });
    // });
  } catch (err) {
    console.error("send-bulk");
  }
});

module.exports = router;
