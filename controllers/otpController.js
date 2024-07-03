const { default: toast } = require("react-hot-toast");
const models = require("../models");
const otpGenerator = require("otp-generator");
const OTP = models.OTP;
const User = models.User;
const otpdata = models.OTP;

if (!OTP || !User) {
  console.error(
    "Models are not defined correctly. Please check your model imports."
  );
}

exports.sendOTP = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    // Extract email or phone from the request body
    const { email, phone } = req.body;
    console.log("Email:", email, "Phone:", phone);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message:
          "No recipient provided. Please provide a valid email address or phone number.",
      });
    }

    if (email && !emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format. Please provide a valid email address.",
      });
    }

    if (phone && !phonePattern.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone format. Please provide a valid phone number.",
      });
    }

    // Check if user is already present
    let checkUserPresent;
    if (email) {
      checkUserPresent = await User.findOne({ where: { email } });
    } else if (phone) {
      checkUserPresent = await User.findOne({ where: { phone } });
    }

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
        showToast: true, // Custom flag to trigger toast
      });
    }

    // Check if an OTP is already present for the recipient
    let checkOtpPresent;
    if (email) {
      checkOtpPresent = await OTP.findOne({ where: { email } });
    } else if (phone) {
      checkOtpPresent = await OTP.findOne({ where: { phone } });
    }

    if (checkOtpPresent) {
      return res.status(401).json({
        success: false,
        message: "OTP is already sent to this recipient",
      });
    }

    // Generate a unique 4-digit OTP
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ where: { otp } });
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ where: { otp } });
    }

    const otpPayload = { email, phone, otp };
    console.log("OTP Payload:", otpPayload);
    await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getotpmap = async (filter) => {
  logger.info("Get Otp");
  try {
    let otplist = await otpdata.findAndCountAll({
      include: [
        {
          model: OTP, // Specify the association between Vehicle and VehicleType
          as: "OTP", // Assuming the association alias is 'VehicleType'
        },
      ],
    });
    return otplist;
  } catch (err) {
    logger.error(err);
    throw new InternalError(err);
  }
};
