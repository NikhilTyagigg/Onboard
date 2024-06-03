"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const mailSender = require("../utils/mailSender");

module.exports = (sequelize) => {
  class otps extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  otps.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OTP",
      timestamps: false,
    }
  );

  otps.beforeCreate(async (otp) => {
    console.log("New document saved to the database");
    console.log(otp.email, otp.otp);
    await sendVerificationEmail(otp.email, otp.otp);
  });

  // Define a function to send emails
  async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        `<h1>Please confirm your OTP</h1>
        <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
  }

  // Periodically delete expired OTPs every 5 minutes
  setInterval(async () => {
    try {
      const result = await otps.destroy({
        where: {
          createdAt: {
            [Op.lt]: sequelize.literal("NOW() - INTERVAL 5 MINUTE"),
          },
        },
      });
      console.log(`Deleted ${result} expired OTP(s)`);
    } catch (error) {
      console.error("Error deleting expired OTPs: ", error);
    }
  }, 5 * 60 * 1000); // 5 minutes

  return otps;
};
