var async = require("async");
var mailCompose = require("./mailCompose");

const DOMAIN = "sandboxa9362837cf4f4b1ca75f325216ac2b8e.mailgun.org";
const api_key = "9e91381d8c5088b2140f67f03315d628-7fba8a4e-31179542";

const mailgun_js = require("mailgun-js");

var mailgun = mailgun_js({ apiKey: api_key, domain: DOMAIN });

// var mail = {
//   from: "Excited User <me@samples.mailgun.org>",
//   to: "",
//   subject: "",
//   text: "Testing some Mailgun awesomeness!"
// };

module.exports = {
  // Email to send when user with the generated OTP.
  sendOTPToVisitor: function (email, generatedCode) {
    this.email = email;
    this.generatedCode = generatedCode;

    new Promise((resolve, reject) => {
      var mail = {
        from:
          "Sender Dan <dan@sandboxa9362837cf4f4b1ca75f325216ac2b8e.mailgun.org>",
        to: "danwijayaa@gmail.com",
        subject:
          "One time Code to view download the document that you requested",
        text: "Testing some Mailgun awesomeness!",
        html: mailCompose.otpSendingEmail(generatedCode, email),
      };

      mailgun.messages().send(mail, function (err) {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },
};

/*

https://caolan.github.io/async/docs.html#waterfall

waterfall will take both anonymous function or named function in its chain of function execution.

In above, sendMail() is my named function that I am declaring within the async.
According to the repo, this is what the waterfall does.
"Runs an array of functions in series, each passing their results to the next in the array.
However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error."

module.exports = {
  sendOTPToVisitor: data => {
    mailgun.messages().send(data, (err, body) => {
      console.log(body);
    });
  }
};

*/
