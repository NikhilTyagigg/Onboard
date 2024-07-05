const bcrypt = require("bcrypt");
const { User } = require("../models"); // Adjust the path as per your structure

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body; // Assuming user info is added to req.user by middleware

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "You cannot use the same password as previously set",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update({ password: hashedPassword }, { where: { email } });
    await User.update(
      { ConfirmPassword: hashedPassword },
      { where: { email } }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
