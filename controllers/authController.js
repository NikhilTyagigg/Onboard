// controllers/authController.js
const models = require("../models");

const User = models.User;

exports.checkUser = async (req, res) => {
  try {
    const { phone, email } = req.body;
    console.log("Received query parameters:", { phone, email });

    if (!phone && !email) {
      return res.status(400).json({ message: "Phone or email is required" });
    }

    let user;
    if (phone) {
      user = await User.findOne({ where: { phone } });
    } else if (email) {
      user = await User.findOne({ where: { email: email.toLowerCase() } });
    }

    console.log("Query result:", user);

    if (user) {
      return res.status(200).json({ message: "User found" });
    } else {
      return res
        .status(404)
        .json({ message: "User not found. Please register yourself first" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
