const models = require("../models");
const OTP = models.OTP;
const User = models.User;
const { validationResult } = require("express-validator");

if (!OTP || !User) {
  console.error(
    "Models are not defined correctly. Please check your model imports."
  );
}

exports.verifyotp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, userOtp, otp } = req.body;
    console.log("Verifying OTP for email:", email);

    // Check if the provided userOtp matches the otp for the email
    if (userOtp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find the OTP record for the provided email and OTP
    const otpRecord = await OTP.findOne({ where: { email, otp: userOtp } });

    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if the OTP is expired
    const currentTime = new Date();
    if (otpRecord.expiration < currentTime) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // If the OTP is valid and not expired, you can proceed with your logic
    // For example, you might want to create a new user or reset a password, etc.

    // Remove the used OTP from the database
    await OTP.destroy({ where: { email, otp: userOtp } });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
