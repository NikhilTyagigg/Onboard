var express = require("express");
var path = require("path");
const cors = require("cors");
var dotenv = require("dotenv");
const logger = require("./helper/logger");
var mLogger = require("morgan");
const mqtt = require("./helper/mqtt");
dotenv.config();
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./swagger.json");

var app = express("");

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};
app.use(mLogger("combined", { stream: logger.stream }));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const apiV1Router = require("./routes/api/v1");

app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", apiV1Router);

app.get("/", function (req, res, next) {
  return res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// error handler
app.use(function (err, req, res, next) {
  // only providing error in development
  const isDevelopment = req.app.get("env") === "development";
  const errorResponse = {
    message: err.message,
    ...(isDevelopment && { error: err }), // only include error details in development
  };

  res.status(err.status || 500).json(errorResponse);
});

app.get("/*", function (req, res, next) {
  return res.sendFile(path.join(__dirname, "build/index.html"));
});

mqtt.connectToMqtt();

module.exports = app;
