import axios from "axios";

/* otpStatus 
1 -> OTP input from user is correct
2 -> OTP is incorrect, require user to fill in again
3 -> OTP has expired, require user to generate new OTP 
*/
export const sendBulkRegistrationEmail = (data) => {
  return axios
    .post("/api/email-service/send-bulk-register-email", data)
    .then((res) => {
      console.log("Email to verify bulk registration is sent successfully");
      return res.data;
    })
    .catch((err) => {
      console.error("sendOTPRegistrationEmail failed");
      throw err;
    });
};

export const sendOTPRegistrationEmail = (data) => {
  // data will have {email, name }
  return axios
    .post("/api/email-service/send-otp-registration-email", data)
    .then((res) => {
      console.log("Email to verify registration is sent successfully");
      return res.data;
    })
    .catch((err) => {
      console.error("sendOTPRegistrationEmail failed");
      throw err;
    });
};

export const verifyOTPRegistration = (data) => {
  // data will have {email, otp}
  return axios
    .post("/api/email-service/verify-otp-registration", data)
    .then((res) => {
      let { otpStatus } = res.data;
      if (otpStatus === 1) {
        return { success: true, message: "Kode verifikasi benar" };
      }
      if (otpStatus === 2) {
        return {
          success: false,
          message: "Kode verifikasi salah, silahkan diperiksa lagi",
        };
      }
      if (otpStatus === 3) {
        return {
          success: false,
          message:
            "Kode verifikasi sudah tidak berlaku, silahkan minta kode verifikasi lagi",
        };
      }
      if (otpStatus === 4) {
        return {
          success: false,
          message:
            "Kode verifikasi telah digunakan, silahkan minta kode verifikasi lagi",
        };
      }
      return { success: false, message: "Terjadi masalah di verifikasi kode" };
    })
    .catch((err) => {
      console.error("verifyRegisterOTP failed");
      throw err;
    });
};
