import axios from "axios";

export const verifyRegistration = (user) => {
  // user will have:
  /*
    {
        name: 
        email: 
    }
    */
  return axios
    .post("/verifyRegistration", user)
    .then((res) => {
      console.log("Email to verify registration is sent successfully");
      return res.data;
    })
    .catch((err) => {
      console.error("Email failed to sent");
      throw err;
    });
};
