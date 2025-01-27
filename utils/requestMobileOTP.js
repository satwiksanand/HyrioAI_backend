const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from Twilio
const client = twilio(accountSid, authToken);

async function sendMobileOTP(to, otp) {
  try {
    const response = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("Message sent successfully:", response.sid);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

module.exports = sendMobileOTP;
