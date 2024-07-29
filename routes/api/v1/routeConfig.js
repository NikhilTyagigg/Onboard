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
const { error } = require("winston");

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
    //const city = req.body.city; // Ensure city is sent in the request body
    const logs = await getQueryLogs();
    res.send(successBody({ logs }));
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e.message });
  }
});

router.post("/getVehicles", async (req, res) => {
  try {
    const userId = req.body.userId;
    const city = req.body.city;
    console.log("Received userId:", userId);
    let vehicle = await getVehicles(req.body.filter, userId, city);
    res.send(successBody({ ...vehicle }));
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e.message });
  }
});

router.post("/addVehicle", async (req, res, next) => {
  try {
    console.log("here is req body = ", req.body);
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
    const records = parseInt(req.query.records) || 1000;
    const routeNo = req.query.routeNo || null;
    const city = req.query.city || null; // Get the city from the query parameters

    let routes = await getRoutes({ page, records, routeNo, city });

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
    let city = req.body.city; // Extract city from request body
    let masterData = await getMasterData(city); // Pass city to getMasterData
    res.send(successBody({ ...masterData }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/getVehicleRouteMap", async (req, res, next) => {
  logger.info("Fetching vehicle route map data");
  const { city } = req.body; // get the city from request body
  try {
    let data = await getRouteVehicleMap(city);
    res.send(successBody({ ...data }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

router.post("/addVehicleConfig", async (req, res, next) => {
  logger.info("Add or update route info");
  try {
    console.log("addvechileconfig=", req.body);
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
    let city = req.body?.city; // Extract city from request body
    let routes = await addMultipleRoute(data, city); // Pass city to addMultipleRoute
    res.send(successBody({ ...routes }));
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

module.exports = router;
