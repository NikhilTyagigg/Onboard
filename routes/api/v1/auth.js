var express = require("express");
const db = require("../../../models");
const moment = require("moment");
const logger = require("../../../helper/logger");

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

router.post(
  "/register",
  runAsyncWrapper(async (req, res, next) => {
    let { name, role, password, email } = req.body;
    try {
      if (!name || !role || !password || !email) {
        throw new UserError("Please fill all the mandatory fields!!");
      }
      let user = await db.User.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        throw new ConflictError("Email Already registered!!");
      }

      user = await db.User.create({
        name: name,
        password: sha512(password),
        email: email,
        role: role,
      });
      res.send(
        successBody({
          msg: "User created successfully. Please login!!",
        })
      );
    } catch (e) {
      logger.error(e);
      throw new Error(e);
    }
  })
);
router.post("/send-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await sendOtp(email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
});

// Route to verify OTP
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
    const isVerified = await verifyOtp(email, otp);
    if (isVerified) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    next(error);
  }
});
// Send password reset email
router.post(
  "/send_reset_password_email",
  runAsyncWrapper(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      throw new UserError("Email is required");
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expireTime = moment().add(1, "hour").toDate();

    await db.PasswordReset.create({
      email: user.email,
      token: sha512(token),
      expiresAt: expireTime,
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${user.email}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset",
      text: `You requested for a password reset. Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
        return next(new ApplicationError("Error sending email"));
      } else {
        res.send(successBody({ msg: "Reset email sent successfully" }));
      }
    });
  })
);

// Reset password
router.post(
  "/reset_password",
  runAsyncWrapper(async (req, res, next) => {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      throw new UserError("All fields are required");
    }

    const passwordReset = await db.PasswordReset.findOne({
      where: {
        email,
        token: sha512(token),
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!passwordReset) {
      throw new NotAuthorizedError("Invalid or expired token");
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.password = sha512(password);
    await user.save();

    await passwordReset.destroy();

    res.send(successBody({ msg: "Password reset successfully" }));
  })
);

module.exports = router;
