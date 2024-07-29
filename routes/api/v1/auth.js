var express = require("express");
const db = require("../../../models");
const moment = require("moment");
const logger = require("../../../helper/logger");
const otpController = require("../../../controllers/otpController");
const verifyOTP = require("../../../controllers/verifyOTP");
const sendResetPasswordEmail = require("../../../controllers/sendResetPasswordEmail");
const authController = require("../../../controllers/authController");
const resetController = require("../../../controllers/resetController");
const jwt = require("../../../auth/jwt");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const verifyAccessToken = require("../../../auth/jwt");

const {
  NotAuthorizedError,
  ApplicationError,
  UserError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} = require("../../../helper/errors");
const {
  grantAccess,
  refreshAccessToken,
  checkAccess,
  removeAccess,
  removeAccessForToken,
} = require("../../../auth/jwt");
const {
  successBody,
  runAsyncWrapper,
  sha512,
} = require("../../../helper/utility");

var router = express.Router();

var Joi = require("joi");

router.get("/me", checkAccess, function (req, res, next) {
  return res.json(req.user);
});

router.post(
  "/login", //checkUserLoggedIn,
  runAsyncWrapper(async (req, res, next) => {
    const { email, password, phone } = req.body;
    //  console.log("here is login info = ", req.body);
    logger.info(`BODYYYYY: ${req.body}`);
    const timezone = req.headers["tz-full"];
    const today_date = moment.utc().toDate();
    let clientDate = moment.tz(today_date, timezone).format("YYYY-MM-DD");
    const expire_time = moment
      .utc(today_date)
      .add(15, "minutes")
      .format("YYYY-MM-DD HH:mm:ssZ");

    try {
      let user;

      if (email) {
        user = await db.User.findOne({
          where: { email },
        });
      }

      // Check login with phone and password
      if (!user && phone) {
        user = await db.User.findOne({
          where: { phone },
        });
      }

      if (!user) {
        throw new NotAuthorizedError("Invalid email or password");
      }

      // Check if the provided password matches the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new NotAuthorizedError("Invalid email/phone or password");
      }

      grantAccess({
        userId: user.userId,
        email: user.email,
        role: user.role,
        phone: user.phone,
      }).then(async (tokens) => {
        // TODO: Log Activity

        res.send(
          successBody({
            userId: user.userId,
            email: user.email,
            name: user.name,
            city: user.city,
            role: user.role,
            identity: user.identity,
            date: clientDate,
            ...tokens,
          })
        );
      });
    } catch (error) {
      next(error);
    }
  })
);

// Backend route to resend OTP
/* refresh the token*/
router.get("/token", function (req, res, next) {
  const refreshToken = req.headers["refreshtoken"];
  //  console.log(`Received refresh token: ${refreshToken}`);

  if (!refreshToken || refreshToken.trim().length === 0) {
    next(new NotAuthorizedError());
    return;
  }

  refreshAccessToken(refreshToken)
    .then((accessToken) => {
      //   console.log(`Generated access token: ${accessToken}`);
      res.send({ token: accessToken });
    })
    .catch((err) => {
      console.error("Error refreshing token:", err);
      if (err instanceof NotAuthorizedError) {
        next(err);
      } else {
        next(new UserError("Invalid request"));
      }
    });
});
router.get("/token_verify/", async function (req, res, next) {
  try {
    const payload = req.body.token;
    // console.log("==================", payload); // assuming payload is passed as a query parameter
    const response = await jwt.verifyAccessToken(payload);
    res.json(response.data);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", verifyOTP.verifyotp);
router.post("/check", authController.checkUser);
router.post("/reset_password", resetController.resetPassword);

router.post(
  "/logout",
  checkAccess,
  runAsyncWrapper(async (req, res, next) => {
    //TODO: :og Activity

    removeAccess(req).then(() => {
      res.status(200).send({});
    });
  })
);
router.get(
  "/registered-emails",
  runAsyncWrapper(async (req, res, next) => {
    try {
      const users = await db.User.findAll({
        attributes: ["userId", "email", "role", "city"], // Select only necessary fields
      });

      res.send(successBody({ data: users }));
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/register",
  runAsyncWrapper(async (req, res, next) => {
    const { full_name, contact, password, ConfirmPassword, city } = req.body;

    try {
      if (!full_name || !contact || !password || !ConfirmPassword || !city) {
        throw new UserError("Please fill all the mandatory fields!!");
      }

      if (password !== ConfirmPassword) {
        throw new UserError("Passwords do not match!!");
      }

      let user;
      const isEmail = /\S+@\S+\.\S+/.test(contact);

      if (isEmail) {
        user = await db.User.findOne({ where: { email: contact } });
        if (user) {
          throw new ConflictError("Email already registered!!");
        }
      } else {
        user = await db.User.findOne({ where: { phone: contact } });
        if (user) {
          throw new ConflictError("Phone number already registered!!");
        }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user record in the database
      user = await db.User.create({
        name: full_name,
        password: hashedPassword,
        ConfirmPassword: hashedPassword,
        email: isEmail ? contact : null,
        phone: isEmail ? null : contact,
        role: 2, // Assuming role 1 corresponds to a standard user role
        city: city,
      });

      // Assuming you have an OTP service to send and validate OTPs
      // You can handle OTP sending and validation separately

      res.send(
        successBody({
          msg: "User created successfully. Please verify the OTP!!",
        })
      );
    } catch (e) {
      logger.error(e);
      next(e);
    }
  })
);

// Set OTP expiration time (e.g., 4 minutes)
const OTP_EXPIRATION_TIME = 4 * 60 * 1000; // 4 minutes in milliseconds

router.post("/send_reset_password_email", async (req, res) => {
  try {
    // console.log("Request body:", req.body);

    const { email, phone } = req.body; // Extract phone as well
    // console.log("Extracted email:", email);
    // console.log("Extracted phone:", phone);

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // Generate OTP
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Calculate OTP expiration time
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

    // Save OTP in the database
    await db.OTP.create({
      email: email || null,
      phone: phone || null,
      otp,
      expiresAt,
    });

    // Send OTP via email or SMS
    if (email) {
      await sendResetPasswordEmail(email, otp);
    } else if (phone) {
      // Implement your SMS sending logic here
    }
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Reset password
router.post("/getotp", async (req, res, next) => {
  logger.info("Fetching otp data");
  try {
    let data = await getotpmap();
    res.send(successBody({ ...data }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});
router.post("/changerole", async (req, res) => {
  const { userId, role } = req.body;

  // Validate input
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userId or role" });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/fetch_user_by_id", async (req, res) => {
  //console.log("dekh dekh dekh = ", req.body);
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
