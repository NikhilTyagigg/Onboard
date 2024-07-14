const logger = require("./logger");
const awsIot = require("aws-iot-device-sdk");
const models = require("../models");
const { MQTT_DATA_SOURCES } = require("./constant");

const QueryLogs = models.QueryLog;
const Vehicle = models.Vehicle;
const Route = models.Route;
const VehicleRouteDriverMaps = models.VehicleRouteDriverMap;

const device = awsIot.device({
  clientId: "onboarddevtestdevice",
  host: "a31nhrmeyspsde-ats.iot.ap-south-1.amazonaws.com",
  certPath: "onboarddevtestdevice.cert.pem",
  keyPath: "onboarddevtestdevice.private.key",
  caPath: "root-CA.crt",
});

var main = {};

main.connectToMqtt = () => {
  device.on("connect", function () {
    console.log("STEP - Connecting to AWS IoT Core");
    console.log(
      `---------------------------------------------------------------------------------`
    );
  });

  device.subscribe("devices/bus1");

  device.on("message", async function (topic, payload) {
    console.log("message", topic, payload.toString());

    try {
      payload = JSON.parse(payload.toString());

      // Check if UserType is valid
      if (
        !payload["UserType"] ||
        ![
          MQTT_DATA_SOURCES.MOBILE_APP,
          MQTT_DATA_SOURCES.USER_MODULE,
          MQTT_DATA_SOURCES.WEB_APP,
        ].includes(payload["UserType"])
      ) {
        logger.debug(
          `The payload is not in appropriate format for topic: ${topic} & payload: ${JSON.stringify(
            payload
          )}`
        );
        return;
      }

      // Handle WEB_APP UserType
      if (payload["UserType"] === MQTT_DATA_SOURCES.WEB_APP) {
        console.log("Processing WEB_APP payload");

        const vehicle =
          payload["Bus ID"] &&
          (await Vehicle.findOne({
            where: { vehicleModule: payload["Bus ID"], isActive: true },
          }));

        const route =
          payload["Route_NO"] &&
          (await Route.findOne({
            where: { routeNo: payload["Route_NO"] },
          }));

        if (vehicle && route) {
          const vehicleMap = await VehicleRouteDriverMaps.findOne({
            where: { vehicleId: vehicle.vehicleId, routeId: route.routeId },
            order: [["dateAndTime", "DESC"]],
          });

          if (vehicleMap) {
            await vehicleMap.update({
              isVerified: true,
              dateAndTime: payload["date&Time"] || new Date(),
            });
          }
        }
        return;
      }

      // Handle other UserType
      const vehicle =
        payload["Bus ID"] &&
        (await Vehicle.findOne({
          where: { vehicleModule: payload["Bus ID"], isActive: true },
        }));

      if (vehicle) {
        const log = {
          vehicleNo: vehicle.vehicleNo || "",
          routeNo: payload["Route_NO"] || "",
          rssi: payload["Sig RSSI"] || "",
          ackTime: payload["Ack Time"] || "",
          userId: payload["User ID"] || 1,
          source: payload["UserType"],
          requestedAt: payload["date&Time"] || new Date(),
          module: payload["Bus ID"] || "",
        };
        await QueryLogs.create(log);
      }
    } catch (err) {
      logger.error(`Error processing message: ${err}`);
    }
  });

  device.on("error", function (topic, payload) {
    console.log("Error:", topic, payload?.toString());
    logger.error(`Error: ${topic} ${payload?.toString()}`);
  });
};

main.publishToMqtt = (data) => {
  logger.info(`Publish to mqtt: ${JSON.stringify(data)}`);
  try {
    device.publish(data["Bus Id"], JSON.stringify(data));
  } catch (err) {
    logger.error(`Error publishing to MQTT: ${err}`);
  }
};

module.exports = main;
