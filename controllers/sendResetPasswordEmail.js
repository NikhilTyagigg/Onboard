const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Ensure crypto module is imported

async function sendResetPasswordEmail(email) {
  try {
    console.log("Email parameter received:", email); // Log the email parameter

    if (!email) {
      throw new Error("No email address provided");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

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
      subject: "Reset Password",
      text: "Click the link to reset your password: <link>",
      html: `<p>Click the link to reset your password: <a href="http://localhost:3000/reset-password?email=${encodeURIComponent(
        email
      )}&reset-token=${resetToken}">Reset Password</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error in sendResetPasswordEmail:", error.message);
    throw new Error("Failed to send reset password email");
  }
}

module.exports = sendResetPasswordEmail;
