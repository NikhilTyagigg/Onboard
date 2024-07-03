var express = require("express");
const db = require("../../../models");
const moment = require("moment");
const logger = require("../../../helper/logger");
const otpController = require("../../../controllers/otpController");
const verifyOTP = require("../../../controllers/verifyOTP");
const sendResetPasswordEmail = require("../../../controllers/sendResetPasswordEmail");
const jwt = require("../../../auth/jwt");

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
    console.log("here is login info = ", req.body);
    logger.info(`BODYYYYY: ${req.body}`);
    const timezone = req.headers["tz-full"];
    var today_date = moment.utc().toDate();
    let clientDate = moment.tz(today_date, timezone).format("YYYY-MM-DD");
    var expire_time = moment
      .utc(today_date)
      .add(15, "minutes")
      .format("YYYY-MM-DD HH:mm:ssZ");

    try {
      var user;

      // Check login with email and password
      if (email) {
        user = await db.User.findOne({
          where: {
            email,
            password: sha512(password),
          },
        });
      }

      // Check login with phone and password
      if (!user && phone) {
        user = await db.User.findOne({
          where: {
            phone,
            password: sha512(password),
          },
        });
      }

      if (!user) {
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
  var refreshToken = req.headers["refreshtoken"];
  if (!refreshToken || refreshToken.trim().length === 0) {
    next(new NotAuthorizedError());
    return;
  }
  refreshAccessToken(refreshToken)
    .then((accessToken) => {
      res.send({ token: accessToken });
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof ApplicationError) {
        next(err);
      } else {
        next(new UserError("Invalid request"));
      }
    });
});
router.get("/token_verify/", async function (req, res, next) {
  try {
    const payload = req.body.token;
    console.log("==================", payload); // assuming payload is passed as a query parameter
    const response = await jwt.verifyAccessToken(payload);
    res.json(response.data);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", verifyOTP.verifyotp);

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
// router.post(
//   "/register",
//   runAsyncWrapper(async (req, res, next) => {
//     let { name, role, password, email } = req.body;
//     try {
//       if (!name || !role || !password || !email) {
//         throw new UserError("Please fill all the mandatory fields!!");
//       }
//       let user = await db.User.findOne({
//         where: {
//           email: email,
//         },
//       });
//       if (user) {
//         throw new ConflictError("Email Already registered!!");
//       }
//       user = await db.User.create({
//         name: name,
//         password: sha512(password),
//         email: email,
//         role: role,
//       });
//       res.send(
//         successBody({
//           msg: "User created successfully. Please login!!",
//         })
//       );
//     } catch (e) {
//       logger.error(e);
//       throw new Error(e);
//     }
//   })
// );
router.post(
  "/register",
  runAsyncWrapper(async (req, res, next) => {
    const { full_name, contact, password, ConfirmPassword, dob, identity } =
      req.body;

    try {
      if (
        !full_name ||
        !contact ||
        !password ||
        !ConfirmPassword ||
        !dob ||
        !identity
      ) {
        throw new UserError("Please fill all the mandatory fields!!");
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

      // Create the user record in the database
      user = await db.User.create({
        name: full_name,
        password: sha512(password),
        ConfirmPassword: sha512(ConfirmPassword), // Ensure you have a proper hashing function like sha512
        email: isEmail ? contact : null,
        phone: isEmail ? null : contact,
        role: 1, // Assuming role 1 corresponds to a standard user role
        dob: dob,
        identity: identity,
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
      throw new Error(e);
    }
  })
);

router.post("/send_reset_password_email", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { email } = req.body;
    console.log("Extracted email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await sendResetPasswordEmail(email);
    res.status(200).json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.error("Error sending reset password email:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Reset password
router.post("/reset_password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in /reset-password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
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
router.post("/fetch_user_by_id", async (req, res) => {
  console.log("dekh dekh dekh = ", req.body);
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
