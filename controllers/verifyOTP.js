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
    console.log("Verifying OTP for request body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, phone, userOtp } = req.body;
    console.log("Verifying OTP for email or phone:", email || phone);

    // Ensure either email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone must be provided.",
      });
    }

    // Construct where condition based on email or phone
    const whereCondition = email
      ? { email, otp: userOtp }
      : { phone, otp: userOtp };

    // Find the OTP record for the provided email or phone and OTP
    console.log("here is wherec= ", whereCondition);
    const otpRecord = await OTP.findOne({ where: whereCondition });
    console.log(otpRecord);

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
    await OTP.destroy({ where: whereCondition });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
