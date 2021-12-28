const express = require("express");
const router = express.Router();
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
const SES_CONFIG = {
  accessKeyId: "AKIAZX2Y2D6EGMUWACYT",
  secretAccessKey: "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",
  region: "ap-southeast-1",
};

const ses = new AWS.SES(SES_CONFIG);

router.post("/verifyRegistration", async (req, res) => {
  try {
    let { email, name } = req.body;
    const OTP = 0;
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
            Data: `Halo <b>${name}</b>, <br/> Ini Kode akun registrasi anda: ${OTP}. Kode ini berlaku selama 3 menit.
          Silahkan memasukkan Kode ini di aplikasi Schooly untuk melanjutkan pendaftaran. 
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
      Source: "schoolysystem@gmail.com" /* required */,
    };

    // Create the promise and SES service object
    const data = await ses.sendEmail(params).promise();
    console.log(data.MessageId);
  } catch (err) {
    console.error(err);
  }
});

// Handle promise's fulfilled/rejected states
