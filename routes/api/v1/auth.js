var express = require("express");
const db = require("../../../models");
const moment = require("moment");
const logger = require("../../../helper/logger");
const otpController = require("../../../controllers/otpController");
const verifyOTP = require("../../../controllers/verifyOTP");
const sendResetPasswordEmail = require("../../../controllers/sendResetPasswordEmail");

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
    const { email, password } = req.body;
    logger.info(`BODYYYYY: ${req.body}`);
    const timezone = req.headers["tz-full"];
    var today_date = moment.utc().toDate();
    let clientDate = moment.tz(today_date, timezone).format("YYYY-MM-DD");
    var expire_time = moment
      .utc(today_date)
      .add(15, "minutes")
      .format("YYYY-MM-DD HH:mm:ssZ");

    try {
      var user = await db.User.findOne({
        where: {
          email,
          password: sha512(password),
        },
      });

      if (!user) {
        throw new NotAuthorizedError("Invalid email or password");
      }

      grantAccess({
        userId: user.userId,
        email: user.email,
        role: user.role,
      }).then(async (tokens) => {
        //TODO: Log Activity

        res.send(
          successBody({
            userId: user.userId,
            email: user.email,
            name: user.name,
            role: user.role,
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
    const payload = req.query.payload; // assuming payload is passed as a query parameter
    const response = await verifyToken(payload);
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
    const { full_name, role, password, contact } = req.body;
    try {
      if (!full_name || !role || !password || !contact) {
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

      user = await db.User.create({
        name: full_name,
        password: sha512(password),
        email: isEmail ? contact : null,
        phone: isEmail ? null : contact,
        role,
      });

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

module.exports = router;
