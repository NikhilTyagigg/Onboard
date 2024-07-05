const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function sendResetPasswordEmail(email, otp) {
  try {
    console.log("Email parameter received:", email);

    if (!email || !otp) {
      throw new Error("Email address and OTP are required");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP (One-Time Password) is: ${otp}`,
      html: `<p>Your OTP (One-Time Password) is: <strong>${otp}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error in sendOTPEmail:", error.message);
    throw new Error("Failed to send OTP email");
  }
}

module.exports = sendResetPasswordEmail;
