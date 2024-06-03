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
    const email = Object.keys(req.body)[0];
    console.log("Received email:", email);

    // Check if user is already present
    const checkUserPresent = await User.findOne({ where: { email } });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
        showToast: true, // Custom flag to trigger toast
      });
    }

    // Check if an OTP is already present for the email
    const checkOtpPresent = await OTP.findOne({ where: { email } });
    if (checkOtpPresent) {
      return res.status(401).json({
        success: false,
        message: "OTP is already sent to this email",
      });
    }

    // Generate a unique 6-digit OTP
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

    const otpPayload = { email, otp };
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
