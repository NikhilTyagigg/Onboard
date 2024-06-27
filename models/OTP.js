"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const mailSender = require("../utils/mailSender");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = (sequelize) => {
  class OTP extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  OTP.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
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

  OTP.beforeCreate(async (otp) => {
    console.log("New OTP entry:");
    console.log(otp);
    try {
      if (otp.phone) {
        otp.phone = formatPhoneNumber(otp.phone);
        if (isValidIndianPhoneNumber(otp.phone)) {
          await sendVerificationSMS(otp.phone, otp.otp);
          console.log("SMS sent to phone:", otp.phone);
        } else {
          throw new Error(
            "Invalid phone number. OTPs can only be sent to Indian phone numbers."
          );
        }
      } else if (otp.email) {
        await sendVerificationEmail(otp.email, otp.otp);
        console.log("Email sent to:", otp.email);
      }
    } catch (error) {
      console.error("Error occurred in OTP beforeCreate hook:", error);
      throw error;
    }
  });

  function isValidIndianPhoneNumber(phoneNumber) {
    const indianPhoneRegex = /^\+91[6-9][0-9]{9}$/;
    return indianPhoneRegex.test(phoneNumber);
  }

  function formatPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/^\+?91|\s+/g, "");
    return `+91${phoneNumber}`;
  }

  async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email/Phone Number",
        `<h1>Please confirm your OTP</h1>
        <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully:", mailResponse);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      throw error;
    }
  }

  async function sendVerificationSMS(phoneNumber, otp) {
    try {
      const params = {
        Message: `Your OTP code is: ${otp}`,
        PhoneNumber: phoneNumber,
      };
      const command = new PublishCommand(params);
      const smsResponse = await snsClient.send(command);
      console.log("SMS Response:", JSON.stringify(smsResponse, null, 2));
    } catch (error) {
      console.error("Error occurred while sending SMS:", error);
      throw error;
    }
  }

  setInterval(async () => {
    try {
      const result = await OTP.destroy({
        where: {
          createdAt: {
            [Op.lt]: sequelize.literal("NOW() - INTERVAL 5 MINUTE"),
          },
        },
      });
      console.log(`Deleted ${result} expired OTP(s)`);
    } catch (error) {
      console.error("Error deleting expired OTPs:", error);
    }
  }, 5 * 60 * 1000);

  return OTP;
};
