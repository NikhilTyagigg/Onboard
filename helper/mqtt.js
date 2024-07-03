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
    console.log("STEP - Connecting to AWS  IoT Core");
    console.log(
      `---------------------------------------------------------------------------------`
    );
  });
  device.subscribe(["#"]);

  device.on("message", async function (topic, payload) {
    console.log("message", topic, payload.toString());

    try {
      payload = JSON.parse(payload.toString());
      if (
        !payload["UserType"] ||
        (payload["UserType"] != MQTT_DATA_SOURCES.MOBILE_APP &&
          payload["UserType"] != MQTT_DATA_SOURCES.USER_MODULE &&
          payload["UserType"] != MQTT_DATA_SOURCES.WEB_APP)
      ) {
        logger.debug(
          "The payload is not in appropriate format for topic::" +
            topic +
            " & payload:: " +
            JSON.stringify(payload)
        );
        return;
      }
      if (payload["UserType"] == MQTT_DATA_SOURCES.WEB_APP) {
        //  if(!payload["Id"]) return
        let vehicle =
          payload["Bus ID"] &&
          (await Vehicle.findOne({
            where: {
              vehicleModule: payload["Bus ID"],
              isActive: true,
            },
          }));
        let route =
          payload["Route_NO"] &&
          (await Route.findOne({
            where: {
              routeNo: payload["Route_NO"],
            },
          }));
        if (route && vehicle) {
          let vehicleMap = await VehicleRouteDriverMaps.findOne({
            where: {
              vehicleId: vehicle.vehicleId,
              routeId: route.routeId,
            },
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

      let vehicle =
        payload["Bus ID"] &&
        (await Vehicle.findOne({
          where: {
            vehicleModule: payload["Bus ID"],
            isActive: true,
          },
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
      logger.error(err);
    }
  });

  device.on("error", function (topic, payload) {
    console.log("Error:", topic, payload?.toString());
    logger.error("Error:" + topic + payload?.toString());
  });
};

main.publishToMqtt = (data) => {
  logger.info("Publish to mqtt::" + JSON.stringify(data));
  try {
    console.log("ye kaam kiya??");
    device.publish(data["Bus Id"], JSON.stringify(data));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = main;
