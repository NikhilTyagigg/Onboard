const express = require("express");
const router = express.Router();
const logger = require("../../../helper/logger");
const db = require("../../../models");
const {
  ErrorCodes,
  NotFoundError,
  ApplicationError,
  UserError,
} = require("../../../helper/errors");
const { checkAccess } = require("../../../auth/jwt");
const Sequelize = db.Sequelize;
const errorBody = (err) => ({ code: err.code, message: err.message });

const authRouter = require("./auth");
const routeRouter = require("./routeConfig");

router.use("/auth", authRouter);
router.use("/route", checkAccess, routeRouter);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Handle all not found errors
router.use(function (req, res, next) {
  const err = new NotFoundError(req.url);
  logger.error(`${err} USER ID`);
  res.status(404).send(errorBody(err));
});

// Error handler
router.use(function (err, req, res, next) {
  logger.error(err);

  if (err instanceof Sequelize.ForeignKeyConstraintError) {
    logger.alert(err);
    err = new UserError(
      "This resource is being used by some other resource",
      ErrorCodes.ERR_VALIDATION
    );
  } else if (err instanceof Sequelize.ValidationError) {
    logger.alert(err);
    err = new UserError("Validation failed", ErrorCodes.ERR_VALIDATION);
  } else if (err instanceof Sequelize.DatabaseError) {
    logger.alert(err);
    err = new UserError("Database error", ErrorCodes.ERR_DATABASE, 500);
  } else if (err instanceof Sequelize.TimeoutError) {
    logger.alert(err);
    err = new UserError(
      "Database query timeout",
      ErrorCodes.ERR_DATABASE_TIMEOUT,
      500
    );
  } else if (err instanceof Sequelize.UniqueConstraintError) {
    logger.alert(err);
    err = new UserError("Already exists", ErrorCodes.ERR_VALIDATION);
  } else if (err instanceof Sequelize.Error) {
    logger.alert(err);
    err = new UserError("Something went wrong!!");
  } else if (
    (err instanceof Error && err.name === "ValidationError") ||
    err instanceof ApplicationError
  ) {
    // leave the error as is
  } else {
    logger.alert(err);
    err = new UserError(err?.message || "Something went wrong!!");
  }

  res.status(err.httpCode || 400).send(errorBody(err));
});

module.exports = router;
