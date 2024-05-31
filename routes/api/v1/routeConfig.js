var express = require("express");
const { Sequelize } = require("sequelize");

const {
  successBody,
  runAsyncWrapper,
  sha512,
} = require("../../../helper/utility");
const {
  configRoutes,
  getQueryLogs,
  getVehicles,
  addVehicle,
  getRoutes,
  addRoute,
  getMasterData,
  getRouteVehicleMap,
  addVehicleRouteMap,
  addMultipleVehicles,
  addMultipleRoute,
} = require("../../../controllers/route.controller");
const logger = require("../../../helper/logger");

var router = express.Router();

router.post("/updateRouteMap", async (req, res) => {
  try {
    await configRoutes();
    res.send(successBody({ msg: "Published successfully!!" }));
  } catch (e) {
    logger.error(e);
    throw new Error(e);
  }
});

router.post("/getLogs", async (req, res) => {
  try {
    let logs = await getQueryLogs();
    res.send(successBody({ logs }));
  } catch (e) {
    logger.error(e);
    throw new Error(e);
  }
});

router.post("/getVehicles", async (req, res) => {
  try {
    let vehicle = await getVehicles();
    res.send(successBody({ ...vehicle }));
  } catch (e) {
    logger.error(e);
    throw new Error(e);
  }
});

router.post("/addVehicle", async (req, res, next) => {
  try {
    let vehicle = await addVehicle(req.body);
    res.send(successBody({ ...vehicle }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/getRoutes", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const records = parseInt(req.query.records) || 10;

    let routes = await getRoutes({ page, records });

    res.send(successBody(routes));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/addRoute", async (req, res, next) => {
  logger.info("Add or update route info");
  try {
    console.log(req.body);

    let routes = await addRoute(req.body);
    res.send(successBody({ ...routes }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/getMasterData", async (req, res, next) => {
  logger.info("Fetching master data");
  try {
    let masterData = await getMasterData();
    res.send(successBody({ ...masterData }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/getVehicleRouteMap", async (req, res, next) => {
  logger.info("Fetching vehicle route map data");
  try {
    let data = await getRouteVehicleMap();
    res.send(successBody({ ...data }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/addVehicleConfig", async (req, res, next) => {
  logger.info("Add or update route info");
  try {
    let routes = await addVehicleRouteMap(req.body);
    res.send(successBody({ ...routes }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/addMultipleVehicles", async (req, res, next) => {
  logger.info("Add or update route info");
  try {
    let data = req.body?.vehicles || [];
    let routes = await addMultipleVehicles(data);
    res.send(successBody({ ...routes }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/addMultipleRoutes", async (req, res, next) => {
  logger.info("Add or update route info");
  try {
    let data = req.body?.routes || [];
    let routes = await addMultipleRoute(data);
    res.send(successBody({ ...routes }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

module.exports = router;
