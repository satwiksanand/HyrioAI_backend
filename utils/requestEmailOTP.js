const nodemailer = require("nodemailer");
const customError = require("./customError");

async function sendOtpEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ORG_EMAIL,
      pass: process.env.ORG_API_KEY,
    },
  });

  const mailOptions = {
    from: process.env.ORG_EMAIL,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `Your OTP code is <b>${otp}</b>. Use before 1 hour`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: %s", error);
    throw customError(411, "Email not sent!");
  }
}

module.exports = sendOtpEmail;
